import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  propertySchema,
  updatePropertySchema,
} from "../validators/property.validate.js";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getAllPublicProperties,
  getSingleProperty,
  updateProperty,
} from "../controllers/property.js";
import { optionalProtect } from "../middlewares/optionalAuth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Property
 *   description: Property management APIs
 */

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyName:
 *                 type: string
 *                 example: My PG
 *               state:
 *                 type: string
 *                 example: Madhya Pradesh
 *               city:
 *                 type: string
 *                 example: Bhopal
 *               address:
 *                 type: string
 *                 example: MP Nagar Zone 2
 *               pincode:
 *                 type: string
 *                 example: "462001"
 *     responses:
 *       200:
 *         description: Property created successfully
 */
router.post("/", protect, authorize("OWNER"), validate(propertySchema), createProperty);

/**
 * @swagger
 * /api/properties/my:
 *   get:
 *     summary: Get all properties of logged-in owner
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of owner properties
 */
router.get("/my", protect, authorize("OWNER"), getAllProperties);

/**
 * @swagger
 * /api/properties/public:
 *   get:
 *     summary: Get all public properties
 *     tags: [Property]
 *     responses:
 *       200:
 *         description: List of public properties
 */
router.get("/public", getAllPublicProperties);

/**
 * @swagger
 * /api/properties/{propertyId}:
 *   put:
 *     summary: Update property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyName:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Property updated successfully
 */
router.put(
  "/:propertyId",
  protect,
  authorize("OWNER"),
  validate(updatePropertySchema),
  updateProperty
);

/**
 * @swagger
 * /api/properties/{propertyId}:
 *   delete:
 *     summary: Delete property
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Property deleted successfully
 */
router.delete("/:propertyId", protect, authorize("OWNER"), deleteProperty);

/**
 * @swagger
 * /api/properties/{propertyId}:
 *   get:
 *     summary: Get single property (public or private)
 *     tags: [Property]
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Property details fetched successfully
 */
router.get("/:propertyId", optionalProtect, getSingleProperty);

export default router;