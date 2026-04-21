import { createPropertyService, deletePropertyService, getAllPropertiesService, getPublicPropertiesService, getSinglePropertyService, updatePropertyService } from "../services/property.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createProperty = asyncHandler(async(req, res) => {
    const {id} = req.user;
    const {propertyName, state, city, address, pincode} = req.body;

    const property = await createPropertyService({ownerId:id,propertyName, state, city, address, pincode});

    return res.status(200).json({
        success:true,
        message: "property successfully created",
        data: property
    })
})

export const getAllProperties = asyncHandler(async(req, res) => {
    const {id} = req.user;
    const properties = await getAllPropertiesService({ownerId:id});

    return res.status(200).json({
        success: true,
        message: "Successfully get all properties",
        data: {
             properties,
             count: properties.length,
        }
    })
});

export const getAllPublicProperties = asyncHandler(async(req, res) => {
    const publicProperties = await getPublicPropertiesService();
    return res.status(200).json({
        success:true,
        message: "Successfully get all public properties",
        data:{
            properties: publicProperties,
            count: publicProperties.length,
        }
    })
})

export const updateProperty = asyncHandler(async (req, res) => {
    const {id} = req.user;
    const {propertyId} = req.params;
    
    const property = await updatePropertyService({ownerId:id, propertyId: Number(propertyId), updateData: req.body});

    return res.status(200).json({
        success: true,
        message: "property successfully updated",
        data:{
            property
        }
    })
})

export const deleteProperty = asyncHandler(async (req, res) => {
    const {id} = req.user;
    const {propertyId} = req.params;

    const property = await deletePropertyService({ownerId:id, propertyId: Number(propertyId)});

    return res.status(200).json({
        success: true,
        message: "Successfully property deleted",
        data: property
    })
})

export const getSingleProperty = asyncHandler(async (req, res) => {
    const {propertyId} = req.params;
    let userId;
    if(req.user){
        userId = req.user.id;
    }
    const property = await getSinglePropertyService({userId,propertyId: Number(propertyId)});

    return res.status(200).json({
        success: true,
        message: "Successfully get property",
        data: property
    })
})