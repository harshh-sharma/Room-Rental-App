import {
  createAgreementService,
  endAgreementService,
  getRenterAgreementsService,
  getOwnerAgreementsService,
  getSingleAgreementService,
} from "../services/agreement.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";


export const createAgreement = asyncHandler(async (req, res) => {
  const { id: ownerId } = req.user;
  const { propertyId, roomId } = req.params;

  const {
    renterId,
    rent,
    startDate,
    endDate,
    deposit,

    electricityRate,
    dueDay,
    fixedCharges,
  } = req.body;

  const agreement = await createAgreementService({
    ownerId,
    propertyId: Number(propertyId),
    roomId: Number(roomId),
    renterId,
    rent,
    startDate,
    endDate,
    deposit,
    electricityRate: Number(electricityRate),
    dueDay: Number(dueDay),
    fixedCharges: JSON.parse(fixedCharges),
  });

  return res.status(201).json({
    success: true,
    message: "Agreement created successfully",
    data: agreement,
  });
});



export const endAgreement = asyncHandler(async (req, res) => {
  const { id: ownerId } = req.user;
  const { agreementId, propertyId, roomId } = req.params;

  const agreement = await endAgreementService({
    ownerId,
    agreementId: Number(agreementId),
    propertyId: Number(propertyId),
    roomId: Number(roomId),
  });

  return res.status(200).json({
    success: true,
    message: "Agreement ended successfully",
    data: agreement,
  });
});


export const getOwnerAgreements = asyncHandler(async (req, res) => {
  const { id: ownerId } = req.user;

  const agreements = await getOwnerAgreementsService({ ownerId });

  return res.status(200).json({
    success: true,
    message: "Owner agreements fetched successfully",
    data: agreements,
  });
});



export const getRenterAgreements = asyncHandler(async (req, res) => {
  const { id: renterId } = req.user;

  const agreements = await getRenterAgreementsService({ renterId });

  return res.status(200).json({
    success: true,
    message: "Renter agreements fetched successfully",
    data: agreements,
  });
});



export const getSingleAgreement = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { agreementId } = req.params;

  const agreement = await getSingleAgreementService({
    agreementId: Number(agreementId),
    userId,
  });

  return res.status(200).json({
    success: true,
    message: "Agreement fetched successfully",
    data: agreement,
  });
});