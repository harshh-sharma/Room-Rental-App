export const generateBillService = async ({
  agreementId,
  units,
  calculationType,
  billMonth,
  billYear,
  extraCharges = {}
}) => {

  const agreement = await prisma.agreement.findUnique({
    where: { id: agreementId }
  });

  if (!agreement) {
    throw new AppError("Agreement not found", 404);
  }

  if (!agreement.isActive) {
    throw new AppError("Agreement not active", 400);
  }

  // ✅ strict duplicate check
  const existing = await prisma.bill.findUnique({
    where: {
      agreementId_billMonth_billYear: {
        agreementId,
        billMonth,
        billYear
      }
    }
  });

  if (existing) {
    throw new AppError("Bill already generated", 400);
  }

  const rentAmount = agreement.rent;

  // ✅ electricity calculation
  let electricityAmount = 0;

  if (agreement.electricityRate) {
    if (units === undefined || units === null) {
      throw new AppError("Electricity units required", 400);
    }
    electricityAmount = agreement.electricityRate * units;
  }

  const fixedCharges = agreement.fixedCharges || {};

  const fixedTotal = Object.values(fixedCharges)
    .reduce((sum, val) => sum + Number(val), 0);

  const extraTotal = Object.values(extraCharges)
    .reduce((sum, val) => sum + Number(val), 0);

  const totalAmount =
    rentAmount +
    electricityAmount +
    fixedTotal +
    extraTotal;

  // ✅ safe due date
  const daysInMonth = new Date(billYear, billMonth, 0).getDate();
  const safeDueDay = Math.min(agreement.dueDay, daysInMonth);

  const dueDate = new Date(
    billYear,
    billMonth - 1,
    safeDueDay
  );

  const bill = await prisma.bill.create({
    data: {
      agreementId,
      billMonth,
      billYear,
      rentAmount,
      electricityRate: agreement.electricityRate,
      electricityUnits: units,
      electricityAmount,
      fixedCharges,
      extraCharges,
      totalAmount,
      dueDate,
      calculationType
    }
  });

  return bill;
};