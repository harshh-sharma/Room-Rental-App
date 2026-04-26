import prisma from "../config/db.js";
import { addMeterReadingService, getAllPendingBillRelatedToProperty, getAllReadingForRenterService, getSingleReadingService, updateReadingStatusService } from "../services/meterReading.service";
import asyncHandler from "../utils/asyncHandler.js";

export const addReading = asyncHandler (async (req, res) => {
    const {agreementId} = req.params;
    const {units, iamgeUrl} = req.body;
    const {id} = req.user;

    const reading = await addMeterReadingService({
        userId:id,
        agreementId: Number(agreementId),
        units:Number(units),
        imageUrl
    });

    return res.status(200).json({
        status:true,
        message:"Successfully meter reading created",
        data: reading
    })
})

export const updateReadingStatus = asyncHandler(async (req, res) => {
    const {id} = req.user;
    const {status, rejectionNote} = req.body;
    const {readingId} = req.params;

    const updateReading = await updateReadingStatusService({
        userId:Number(id),
        readingId:Number(readingId),
        status,
        rejectionNote
    });

    return res.status(200).json({
        success: true,
        message:"Successfully reading status updated",
        data: updateReading
    })
});

export const getBillsRelatedToProperty = asyncHandler(async (req, res) => {
    const {id} = req.user;
    const {propertyId} = req.params;

    const bills = await getAllPendingBillRelatedToProperty({userId: id, propertyId: Number(propertyId)});

    return res.status(200).json({
        success:true,
        message:"Successfully bill get related to property",
        data: bills
    })
});


export const getAllReadingForRenter = asyncHandler(async (req, res) => {
    const {id} = req.user;

    const readings = await getAllReadingForRenterService({userId:id});

    return res.status(200).json({
        success:true,
        message:"Successfully get bills",
        data:readings
    })
})

export const getSingleReading = asyncHandler (async (req, res) => {
    const {id} = req.user;
    const {readingId} = req.params;

    const reading = await getSingleReadingService({userId:id, readingId:Number(readingId)});

    return res.status(200).json({
        success:true,
        message:"Successfully get reading detail",
        data:reading
    })
})