// import { asyncHandler } from "../utils/asyncHandler.js";
// import { apiError } from "../utils/apiError.js";
// import { Admin } from "../models/admin.model.js";
// import jwt from "jsonwebtoken"


// export const verifyJWT = asyncHandler(async (req, res, next) => {
//     try {
//         const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

//         if (!token) {
//             throw new apiError(401, "Unauthorized request")//If the token is invalid or expired, it throws an error.
//         }
//         console.log("Token received: ", token);

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

//         const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")

//         if (!admin) {
//             throw new apiError(401, "Invalid Access Token")
//         }

//         req.admin = admin;
//         next()
//     } catch (error) {
//         throw new apiError(401, error?.message || "Invalid access token ulluu")
//     }
// })

import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!admin) {
            
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.admin = admin;
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
    }
    
})