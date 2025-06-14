import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Admin } from "../models/admin.model.js"
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const adminReg = asyncHandler(async (req, res, next) => {
    const { fullName, email, username, password, age, dob } = req.body;
    //for extracting details in form data

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "invalid details brotha")
    }

    const existedAdmin = await Admin.findOne({
        $or: [{ username }, { email }]
    })
    if (existedAdmin) {
        throw new apiError(404, "This Admin already exists, pls login instead");
    }

    const pfpLocalPath = req.files?.pfp?.[0]?.path;

    if (!pfpLocalPath) {
        throw new apiError(400, "no pfp found");
    }

    const pfp = await uploadOnCloudinary(pfpLocalPath)

    if (!pfp) {
        throw new apiError(404, "it wasnt uploaded")
    }

    const admin = await Admin.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        pfp: pfp.url,
        age,
        dob
    })

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    if (!createdAdmin) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, createdAdmin, "User registered successfully")
        )
})

export { adminReg }