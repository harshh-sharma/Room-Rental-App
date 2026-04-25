import { getAllBillsService, getSingleBillService } from "../services/bill.service";
import asyncHandler from "../utils/asyncHandler";

export const getAllBills = asyncHandler(async(req, res) => {
    const {id} = req.user;

    const bills = await getAllBillsService({userId:id});

    return res.status(200).json({
        success:true,
        message:"Successfully get all bills"
    });
})

export const getSingleBill = asyncHandler(async(req, res) => {
    const {id} = req.user;
    const {billId} = req.params;

    const bill = await getSingleBillService({billId, userId:id});

    return res.status(200).json({
        success: true,
        message:"Successfully bill get"
    })
});

