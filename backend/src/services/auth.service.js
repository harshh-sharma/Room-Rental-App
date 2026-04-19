import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendMail.js"
import prisma from "../config/db.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const registerService = async ({
  email,
  password,
  name,
  role = "RENTER",
}) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError("Email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
      emailVerifyToken: verifyToken,
      emailVerifyExpiry: verifyExpiry,
    },
  });

  const verifyUrl = `http://localhost:5000/api/auth/verify-email?token=${verifyToken}`;

  sendEmail({
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Hello ${name}</h2>
      <p>Click below to verify your email:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link expires in 15 minutes</p>
    `,
  }).catch(console.error);

  const { password: _, ...safeUser } = user;

  return safeUser;
};

export const verifyEmailService = async ({ token }) => {
  if (!token) throw new AppError("Token not found", 400);

  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExpiry: {
        gt: new Date(), // not expired
      },
    },
  });

  // 2. If not found
  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  // 3. Update user (mark verified)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpiry: null,
    },
  });

  return { message: "Email verified successfully" };
};


export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not found", 400);
  }

  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email first", 400);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "SECRET",
    {
      expiresIn: process.env.JWT_EXPIRY || "5h",
    }
  );

  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
};

export const getCurrentUserService = async({
  id
}) => {
  if(!id){
    throw new AppError("id not found",400);
  }

  const user = await prisma.user.findUnique({
    where:{id}
  });

  if(!user){
    throw new AppError("User not found", 400);
  }

  const {password , ...safeUser} = user;

  return {user:safeUser};
}

