import prisma from "../config/db"
import AppError from "../utils/AppError";

export const manualPaymentService = async ({
    billId,
    userId,
    amount,
    proofUrl
}) => {
    const bill = await prisma.bill.findUnique({
        where:{id:billId},
        include:{
            agreement: true
        }
    });

    if(!bill){
        throw new AppError("Bill not found", 404);
    }

    if(userId !== bill.agreement.renterId){
        throw new AppError("You are not authorize", 403);
    }

    if(bill.status == "PAID"){
        throw new AppError("Bill already paid", 400);
    }

    const payment = await prisma.payment.create({
        data:{
            billId,
            amount,
            method: "MANUAL",
            status:"PENDING",
            proofUrl
        }
    });

    return payment;
}

export const manualBillApproval = async ({ownerId, paymentId, status, rejectionNote = ""}) => {
    const payment = await prisma.payment.findUnique({
        where:{id:paymentId},
     include: {
        bill: {
            include: {
            agreement: true
            }
  }
}
    });

    if(!payment){
        throw new AppError("Payment not found", 404);
    }

    if(payment.bill.agreement.ownerId !== ownerId){
        throw new AppError("you are not authorize", 403);
    }

    if (payment.status !== "PENDING") {
  throw new AppError("Payment already processed", 400);
}

if (!["SUCCESS", "REJECTED"].includes(status)) {
  throw new AppError("Invalid status", 400);
}

    if(status == "REJECTED" && rejectionNote == ""){
        throw new AppError("Rejection Note is required", 400);
    }

    const updatepaymentStatus = await prisma.payment.update({
        where:{id:paymentId},
        data:{
            status,
            rejectionNote : status === "REJECTED" ? rejectionNote : null
        }
    })

  if (status === "SUCCESS") {
    await prisma.bill.update({
      where: { id: payment.billId },
      data: { status: "PAID" }
    });

    await prisma.agreement.update({
      where: { id: payment.bill.agreement.id },
      data: {
        lastPaidMonth: payment.bill.billMonth,
        lastPaidYear: payment.bill.billYear
      }
    });
  }

  return updatepaymentStatus;
}


export const ownerMarkManually = async ({ ownerId, paymentId }) => {

  const existingPayment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      bill: {
        include: {
          agreement: true
        }
      }
    }
  });

  if (!existingPayment) {
    throw new AppError("Payment not found", 404);
  }

  const bill = existingPayment.bill;

  if (bill.agreement.ownerId !== ownerId) {
    throw new AppError("Not authorized", 403);
  }

  if (bill.status === "PAID") {
    throw new AppError("Bill already paid", 400);
  }

  const newPayment = await prisma.payment.create({
    data: {
      billId: bill.id,
      amount: bill.totalAmount,
      method: "MANUAL",
      status: "SUCCESS",
      rejectionNote: "Marked paid by owner manually",
      proofUrl: null
    }
  });

  await prisma.bill.update({
    where: { id: bill.id },
    data: { status: "PAID" }
  });

  await prisma.agreement.update({
    where: { id: bill.agreement.id },
    data: {
      lastPaidMonth: bill.billMonth,
      lastPaidYear: bill.billYear
    }
  });

  return newPayment;
};

export const retryPayment = async ({
  renterId,
  billId,
  proofUrl
}) => {

  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: {
      agreement: true
    }
  });

  if (!bill) {
    throw new AppError("Bill not found", 404);
  }

  if (bill.agreement.renterId !== renterId) {
    throw new AppError("Not authorized", 403);
  }

  if (bill.status === "PAID") {
    throw new AppError("Bill already paid", 400);
  }

  const successPayment = await prisma.payment.findFirst({
    where: {
      billId,
      status: "SUCCESS"
    }
  });

  if (successPayment) {
    throw new AppError("Bill already paid", 400);
  }

  const pendingPayment = await prisma.payment.findFirst({
    where: {
      billId,
      status: "PENDING"
    }
  });

  if (pendingPayment) {
    throw new AppError("Payment already pending", 400);
  }

  const payment = await prisma.payment.create({
    data: {
      billId,
      amount: bill.totalAmount,
      status: "PENDING",
      proofUrl: proofUrl || null,
      method: "MANUAL"
    }
  });

  return payment;
};

export const getAllPaymentsRelatedToBill = async ({
    billId,
    userId
}) => {
    const bill = await prisma.bill.findUnique({
        where:{id:billId},
        include:{
            payments: true,
            agreement: true
        }
    });

    if(!bill){
        throw new AppError("Bill not found", 404);
    }

    if(!bill.agreement.renterId || !bill.agreement.ownerId){
        throw new AppError("you are not authorize", 403);
    }

    return bill.payments || [];
}


export const getPaymentsByBillService = async({
  billId,
  userId
}) => {
  const bill = await prisma.bill.findUnique({
    where:{id:billId},
    include:{
      agreement: true,
      payments: true
    }
  });

  if(!bill){
    throw new AppError("Bill Not found", 404);
  }

  if (bill.payments.length === 0){
    throw new AppError("Bill have not payments", 400);
  }

  if (
  bill.agreement.renterId !== userId &&
  bill.agreement.ownerId !== userId
) {
  throw new AppError("Not authorized", 403);
}

  return bill.payments || [];
}