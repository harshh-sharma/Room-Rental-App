import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import { propertySchema, updatePropertySchema } from "../validators/property.validate";
import { createProperty, deleteProperty, getAllProperties, getAllPublicProperties, getSingleProperty, updateProperty } from "../controllers/property";
import { optionalProtect } from "../middlewares/optionalAuth.middleware";

const router = Router();

router.post("/", protect, authorize("OWNER"), validate(propertySchema), createProperty);
router.get("/my", protect, authorize("OWNER"), getAllProperties);
router.get("/public", getAllPublicProperties);
router.put("/:propertyId", protect, authorize("OWNER"), validate(updatePropertySchema), updateProperty);
router.delete("/:propertyId", protect, authorize("OWNER"), deleteProperty);
router.get("/:propertyId", optionalProtect, getSingleProperty);

export default router;