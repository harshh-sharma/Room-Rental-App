import cron from "node-cron";
import prisma from "../config/db.js";
import { generateBillService } from "../services/bill.service.js";
import logger from "../utils/logger.js";

export const startBillCron = () => {
  cron.schedule("0 1 * * *", async () => {
    logger.info("Bill cron started");

    const now = new Date();
    const currentMonth = now.getMonth(); // 0–11
    const currentYear = now.getFullYear();

    const prevMonth = currentMonth - 1;
    const billMonth = ((prevMonth + 12) % 12) + 1; // 1–12
    const billYear = prevMonth < 0 ? currentYear - 1 : currentYear;

    const start = new Date(billYear, billMonth - 1, 1);
    const end = new Date(billYear, billMonth, 0);

    logger.info(`Generating bills for ${billMonth}-${billYear}`);

    const agreements = await prisma.agreement.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
    });

    for (const agreement of agreements) {
      try {
        logger.info(`Processing agreement ${agreement.id}`);

        // 🔥 CHECK BILL EXISTS (previous month)
        const existingBill = await prisma.bill.findFirst({
          where: {
            agreementId: agreement.id,
            billMonth,
            billYear,
          },
        });

        if (existingBill) {
          logger.info(`Bill already exists for agreement ${agreement.id}`);
          continue;
        }

        if (
          agreement.lastPaidMonth === billMonth &&
          agreement.lastPaidYear === billYear
        ) {
          logger.info(
            `Skipping bill (already paid) for agreement ${agreement.id}`,
          );
          continue;
        }

        const readings = await prisma.meterReading.findMany({
          where: {
            agreementId: agreement.id,
            createdAt: {
              gte: start,
              lte: end,
            },
            usedInBill: false,
          },
          orderBy: { createdAt: "desc" },
        });

        let units = 0;
        let calculationType = "ESTIMATED";

        const approved = readings.find((r) => r.status === "APPROVED");
        const pending = readings.find((r) => r.status === "PENDING");

        if (approved) {
          units = approved.units;
          calculationType = "ACTUAL";

          logger.info(`ACTUAL bill for agreement ${agreement.id}`);

          await prisma.meterReading.update({
            where: { id: approved.id },
            data: { usedInBill: true },
          });
        } else if (pending) {
          units = pending.units;
          calculationType = "AUTO_APPROVED";

          logger.info(`AUTO_APPROVED bill for agreement ${agreement.id}`);

          await prisma.meterReading.update({
            where: { id: pending.id },
            data: { usedInBill: true },
          });
        } else {
          const lastBill = await prisma.bill.findFirst({
            where: { agreementId: agreement.id },
            orderBy: { createdAt: "desc" },
          });

          units = lastBill?.electricityUnits || 0;
          calculationType = "ESTIMATED";

          logger.info(`ESTIMATED bill for agreement ${agreement.id}`);
        }

        // GENERATE BILL
        await generateBillService({
          agreementId: agreement.id,
          units,
          calculationType,
          billMonth,
          billYear,
        });
      } catch (err) {
        logger.error("Bill cron error", {
          agreementId: agreement.id,
          error: err.message,
          stack: err.stack,
        });
      }
    }

    logger.info("Bill cron finished");
  });
};
