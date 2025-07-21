/**     S1--> requesting accessToken from cookies
        S2--> decoding the token to find out all details stored(gatepass ke andar ke details jaisa)
        S3--> acquiring all the details which we found out
         S4--> This line attaches the full admin’s database details to the request, so that later in your 
            route/controller, you don’t need to refetch the admin again. */

import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js"; // Make sure this path is correct

export const verifyJWT = (allowedRoles = []) => asyncHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new apiError(401, "Unauthorized request: No token");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!decodedToken) {
        throw new apiError(401, "Token is invalid or expired");
    }

    let account;
    // Identify source model based on role in the token
    if (decodedToken.role === "admin") {
         account = await Admin.findById(decodedToken._id).select("-password -refreshToken");
        req.admin = account;
    } else if (decodedToken.role === "user") {
         account = await User.findById(decodedToken._id).select("-password -refreshToken");
        req.user = account;
    }

    // Optional role-based access control
    if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
        throw new apiError(403, "Forbidden: Insufficient role");
    }//this if condition checks if argument is passed or not in allowed roles for the verifyJWT function
    next();
});

