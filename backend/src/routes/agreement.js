import { Router } from "express";
import {
  createAgreement,
  endAgreement,
  getOwnerAgreements,
  getRenterAgreements,
  getSingleAgreement,
} from "../controllers/agreement.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.js";

import {
  createAgreementSchema,
  endAgreementSchema,
  getSingleAgreementSchema,
} from "../validators/agreement.validate.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Agreement
 *   description: Agreement APIs
 */


// =========================
// CREATE AGREEMENT
// =========================
router.post(
  "/:propertyId/:roomId",
  protect,
  authorize("OWNER"),
  validate(createAgreementSchema), // 🔥 VALIDATION
  createAgreement
);


// =========================
// END AGREEMENT
// =========================
router.put(
  "/end/:agreementId/:propertyId/:roomId",
  protect,
  authorize("OWNER"),
  validate(endAgreementSchema), // 🔥 VALIDATION
  endAgreement
);


// =========================
// GET OWNER AGREEMENTS
// =========================
router.get(
  "/owner",
  protect,
  authorize("OWNER"),
  getOwnerAgreements
);


// =========================
// GET RENTER AGREEMENTS
// =========================
router.get(
  "/renter",
  protect,
  authorize("RENTER"),
  getRenterAgreements
);


// =========================
// GET SINGLE AGREEMENT
// =========================
router.get(
  "/:agreementId",
  protect,
  validate(getSingleAgreementSchema), // 🔥 VALIDATION
  getSingleAgreement
);

export default router;