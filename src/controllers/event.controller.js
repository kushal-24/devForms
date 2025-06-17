import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { EventRegister } from "../models/eventRegister.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createNewEvent = asyncHandler(async (req, res, next) => {
    const { eventTitle, organisedBy, mode, themeTags, registrationsStart, registrationsDeadline,
        eventStarts, eventEnds, aboutEvent, description, prizePool, teamSize, contactOC
    } = req.body;

    //coverImg
    const coverImgLocalPath = req.files?.coverImg[0]?.path;
    if (!coverImgLocalPath) {
        throw new apiError(400, "no path of img found");
    }
    const coverImg = await uploadOnCloudinary(coverImgLocalPath);
    if (!coverImg) {
        throw new apiError(401, "cudnt be uploaded");
    }

    //logo
    const logoLocalPath = req.files?.logo[0]?.path;
    if (!logoLocalPath) {
        throw new apiError(400, "no path of img found");
    }
    const logo = await uploadOnCloudinary(logoLocalPath);
    if (!logo) {
        throw new apiError(401, "cudnt be uploaded");
    }

    //sponsImg
    const sponsImgLocalPath = req.files?.sponsImg;//recieved files from postman
    /**
    sponsImgLocalPath= [
            { path: "uploads/file1.jpg", ... },
            { path: "uploads/file2.jpg", ... },
            ....
        ]
     */
    const sponsImgs = [];
    if (sponsImgLocalPath && sponsImgLocalPath.length > 0) {
        for (const file of sponsImgLocalPath) {
            const sponsImg = await uploadOnCloudinary(file.path);
            if (sponsImg?.url) {//this statement is needed to push the urls of multiple files in the same array
                sponsImgs.push(sponsImg.url);
            }
        }
    }

    //pfpOC
    const pfpOCLocalPath = req.files?.pfpOC
    const pfpOCs = []
    if (pfpOCLocalPath && pfpOCLocalPath.length > 0) {
        for (const file of pfpOCLocalPath) {
            const pfpOC = await uploadOnCloudinary(file.path);
            if (pfpOC?.url) {
                pfpOCs.push(pfpOC.url);
            }
        }
    }

    const event = await EventRegister.create({
        eventTitle,
        organisedBy,
        mode,
        themeTags,
        registrationsStart,
        registrationsDeadline,
        eventStarts,
        eventEnds,
        aboutEvent,
        description,
        prizePool,
        pfpOC: pfpOCs,
        sponsImg: sponsImgs,
        coverImg: coverImg.url,
        logo: logo.url,
        teamSize,
        contactOC,
    })


    const createdNewEvent = await EventRegister.findById(event._id);
    if (!createdNewEvent) {
        throw new apiError(500, "server error uhhhhhhhhh")
    }

    const eventId = event._id;
    const registeredCount = await EventRegister.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(eventId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "eventId",
                as: "registrations"
            }
        },
        {
            $addFields: {
                registrationsCount: { $size: "$registrations" }
            }
        },
        {
            $project: {
                eventTitle: 1,
                registrationsCount: 1,
                registrations: {
                    $map: {
                        input: "$registrations",
                        as: "user",//give a temporary name to each registered person as "user"
                        in: {
                            name: "$$user.fullName",
                            email: "$$user.email",
                        }
                    }
                }
            }
        }
    ]);

    /**
        //THE REGISTEREVENT BFORE LOOKUP:
    { 
        _id: ObjectId("123abc"),
        eventTitle: "Hackathon"
    }
        //THE REGISTER EVENT after LOOKUP:
    {
        _id: ObjectId("123abc"),
        eventTitle: "Hackathon",
        registrations: [
        { _id: "user1", fullName: "Alice", eventId: "123abc" },
        { _id: "user2", fullName: "Bob", eventId: "123abc" }
      ]
    }
    */



    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {createdEvent: createdNewEvent,
                registrationStats: registeredCount[0] || " NOTHING AS OF YET CHILLLL :) "},
                "New event has been created!"
            )
        )
})

export { createNewEvent }

/**
EVENT CONTROLLER: 
i. create new event
ii. open registrations for users
iii. close registrations for users
iv. delete event
 */