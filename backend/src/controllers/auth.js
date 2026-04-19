import asyncHandler from "../utils/asyncHandler.js";
import { getCurrentUserService, loginService, registerService, verifyEmailService } from "../services/auth.service.js";
import { registerSchema } from "../validators/auth.validate.js";
import AppError from "../utils/AppError.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

   const saferRegisterSchema = registerSchema.safeParse({name, email,password});
   if(!saferRegisterSchema.success) throw new AppError(saferRegisterSchema)
  const user = await registerService({
    name,
    email,
    password,
    role,
  });



  res.status(201).json({
    success: true,
    data: user,
  });
});

export const verifyEmail = asyncHandler(async(req,  res) => {
  const {token} = req.query;
  const verifyUser = await verifyEmailService({token});

  return res.status(200).json({
    success:true,
    message:"email successfully verified"
  })
})

export const login = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  const data = await loginService({email, password});

  return res.status(200).json({
    success:true,
    message:"user successfully loggedIn",
    data
  })
})

export const getCurrentUser = asyncHandler(async(req, res) => {
  const {id} = req.user;
  const data = await getCurrentUserService({id});
  return res.status(200).json({
    success:true,
    message:"User successfully get",
    data: {user: data.user}
  })
})