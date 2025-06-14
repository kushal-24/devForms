import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { admin } from "../models/admin.model.js"
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const adminReg = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .json({
            message: "WORKS !"
        })
})

export { adminReg }