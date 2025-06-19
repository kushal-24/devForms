import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import {Admin} from "../models/admin.model.js" 
import {EventRegister} from "../models/eventRegister.model.js" 
import jwt from "jsonwebtoken"

const formFill= asyncHandler(async(req,res,next)=>{
    const {eventTitle}= req.params;
    const{fullName, email, mobileNo,gender, status, location, age, type, course ,passingOutYear}=
    req.body;

    

}) 


export {formFill}