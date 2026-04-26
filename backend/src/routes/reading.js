import { Router } from "express";
import { addReading, getAllReadingForRenter, getBillsRelatedToProperty, getSingleReading, updateReadingStatus } from "../controllers/meterReading.controller";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {validate} from "../middlewares/validate.js";
import { addReadingSchema, getBillsByPropertySchema, getReadingsForRenterSchema, updateReadingStatusSchema } from "../validators/reading.validate.js";

const router = Router();

router.post("/" ,validate(addReadingSchema) ,protect, authorize("RENTER"), addReading);
router.patch("/:id/status",validate(updateReadingStatusSchema),protect, authorize("OWNER"),updateReadingStatus);

router.get(
  "/property/:propertyId",
  validate(getBillsByPropertySchema),
  protect,
  authorize("OWNER"),
  getBillsRelatedToProperty
);

router.get(
  "/renter",
   validate(getReadingsForRenterSchema),
  protect,
  authorize("RENTER"),
  getAllReadingForRenter
);

router.get("/renter/:id", protect, authorize("OWNER", "RENTER"),getSingleReading );

export default router;