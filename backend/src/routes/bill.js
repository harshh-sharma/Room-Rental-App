import {Router} from "express";
import { getAllBills, getSingleBill } from "../controllers/bill";

const router = Router();


router.get('/', getAllBills);
router.get("/:billId", getSingleBill);

export default router;