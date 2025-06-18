import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { EventRegister } from "../models/eventRegister.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose"
import { Admin } from "../models/admin.model.js"

const createNewEvent = asyncHandler(async (req, res, next) => {
    const { eventTitle, mode, themeTags, registrationsStart, registrationsDeadline,
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
        organisedBy: req.admin?._id,
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
                {
                    createdEvent: createdNewEvent,
                    registrationStats: registeredCount[0] || " NOTHING AS OF YET CHILLLL :) "
                },
                "New event has been created!"
            )
        )
})

const deleteEvent = asyncHandler(async (req, res, next) => {
    /**
    -->get adminId too
    -->get the eventTitle from admin
    -->delete the event
     */

    const { eventTitle } = req.params;

    const adminId = req.admin?._id;
    const event = await EventRegister.findOne({ eventTitle, organisedBy: adminId })

    if (!event) {
        throw new apiError(404, "sorry we found no such event")
    }

    await EventRegister.findByIdAndDelete(event._id);

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "Event has been deleted successfully"
            )
        )
})

const getEventDetails = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const adminId = req.admin?._id;

    const myEvent = await EventRegister.findOne({ eventTitle, organisedBy: adminId });
    if (!myEvent) {
        throw new apiError(400, "no admin logged in or event cud not be found");
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                myEvent,
                `Details of the event: ${eventTitle}`
            )
        )
})

const editEventDetails = asyncHandler(async (req, res, next) => {
    /**
     --> find the event by id and admin._id
     -->ask them to make changes by using set
     -->.save()
     */
    const { eventname } = req.params; // assuming you're sending eventId in URL param
    const { eventTitle, mode, themeTags, registrationsStart, registrationsDeadline,
        eventStarts, eventEnds, aboutEvent, description, prizePool, teamSize, contactOC } = req.body;

    const adminId = req.admin?._id;
    const event = await EventRegister.findOneAndUpdate({ eventTitle: eventname, organisedBy: adminId },
        {
            $set: {
                eventTitle: eventTitle,
                mode: mode,
                themeTags: themeTags,
                registrationsStart: registrationsStart,
                registrationsDeadline: registrationsDeadline,
                eventStarts: eventStarts,
                eventEnds: eventEnds,
                aboutEvent: aboutEvent,
                description: description,
                prizePool: prizePool,
                teamSize: teamSize,
                contactOC: contactOC,
            }
        },
        {
            new: true,
            runValidators: true, // ✅ validate schema on update
        }
    )
    if (!event) {
        throw new apiError(400, "No such event exists");
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                event,
                "event details are updated successfully"
            )
        )
})

const getAllEvents = asyncHandler(async (req, res, next) => {
    const adminId = req.admin?._id;
    if (!adminId) {
        throw new apiError(500, "no adminId acquired, error");
    }
    const event = await EventRegister.find({ organisedBy: adminId });
    if (!event) {
        throw new apiError(404, "no events present");
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                event,
                "List of all events fetched successfully"
            )
        )
})

//////update and delete files controllers/////////////////////////////////////////////


const updateLogo = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const adminId = req.admin?._id
    const logoLocalPath = req.file?.path
    if (!logoLocalPath) {
        throw new apiError(400, "no logo acquired")
    }
    const logo = await uploadOnCloudinary(logoLocalPath);
    if (!logo) {
        throw new apiError(400, "sorry, couldnt upload it bro :(")
    }

    const event = await EventRegister.findOneAndUpdate({ eventTitle, organisedBy: adminId },
        {
            $set: {
                logo: logo.url
            }
        },
        {
            new: true,
            runValidators: false,
        }
    )
    if (!event) {
        throw new apiError(404, "no event found")
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                event,
                "logo updated successfullyy"
            )
        )
})
const deleteLogo = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const adminId = req.admin?._id;

    const event = await EventRegister.findOneAndUpdate(
        { eventTitle, organisedBy: adminId },
        {
            $unset: { logo: 1 }
        },
        {
            new: true
        }
    );

    if (!event) throw new apiError(404, "Event not found");

    return res.status(200).json(
        new apiResponse(200, event, "Logo deleted")
    );
});



const updatePfpOC = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const adminId = req.admin?._id;
    const pfpOCLocalPath = req.files?.pfpOC;

    const pfpOCs = [];
    if (pfpOCLocalPath && pfpOCLocalPath.length > 0) {
        for (const file of pfpOCLocalPath) {
            const pfpOC = await uploadOnCloudinary(file.path);
            if (pfpOC?.url) {
                pfpOCs.push(pfpOC.url);
            }
        }
    }

    const event = await EventRegister.findOneAndUpdate(
        { eventTitle, organisedBy: adminId },
        {
            $set: {
                pfpOC: pfpOCs,
            }
        },
        {
            new: true,
            runValidators: false,
        }
    );
    if (!event) {
        throw new apiError(404, "No event found");
    }

    return res.status(200).json(
        new apiResponse(200, event, "pfpOC updated successfully")
    );
});
const deletePfpOC = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const { url } = req.body; // URL to remove
    const adminId = req.admin?._id;

    const event = await EventRegister.findOneAndUpdate(
        { eventTitle, organisedBy: adminId },
        {
            $pull: { pfpOC: url }
        },
        {
            new: true
        }
    );

    if (!event) throw new apiError(404, "Event not found");

    return res.status(200).json(
        new apiResponse(200, event, "pfpOC image removed")
    );
});




const updateSponsImg = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const adminId = req.admin?._id;
    const sponsImgLocalPath = req.files?.sponsImg;

    const sponsImgs = [];
    if (sponsImgLocalPath && sponsImgLocalPath.length > 0) {
        for (const file of sponsImgLocalPath) {
            const sponsImg = await uploadOnCloudinary(file.path);
            if (sponsImg?.url) {
                sponsImgs.push(sponsImg.url);
            }
        }
    }

    const event = await EventRegister.findOneAndUpdate(
        { eventTitle, organisedBy: adminId },
        {
            $set: {
                sponsImg: sponsImgs,
            }
        },
        {
            new: true,
            runValidators: false,
        }
    );
    if (!event) {
        throw new apiError(404, "No event found");
    }

    return res.status(200).json(
        new apiResponse(200, event, "sponsImg updated successfully")
    );
});
const deleteSponsImg = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const { url } = req.body; // URL to remove
    const adminId = req.admin?._id;

    const event = await EventRegister.findOneAndUpdate(
        { eventTitle, organisedBy: adminId },
        {
            $pull: { sponsImg: url }//pull operator deleted an item from an array after matching the right item
        },
        {
            new: true
        }
    );

    if (!event) throw new apiError(404, "Event not found");

    return res.
        status(200)
        .json(
            new apiResponse(
                200,
                event,
                "sponsImg removed")
        );
});



const updateCoverImg = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const adminId = req.admin?._id;
    const coverImgLocalPath = req.file?.path
    if (!coverImgLocalPath) {
        throw new apiError(400, "no coverImg acquired")
    }
    const coverImg = await uploadOnCloudinary(coverImgLocalPath);
    if (!coverImg) {
        throw new apiError(400, "sorry, couldnt upload it bro :(")
    }

    const event = await EventRegister.findOneAndUpdate({ eventTitle, organisedBy: adminId },
        {
            $set: {
                coverImg: coverImg.url
            }
        },
        {
            new: true,
            runValidators: false,
        }
    )

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                event,
                "coverImg updated successfully"
            )
        )
})
const deleteCoverImg = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.params;
    const adminId = req.admin?._id;

    const event = await EventRegister.findOneAndUpdate(
        { eventTitle, organisedBy: adminId },
        {
            $unset: { coverImg: 1 }
        },
        {
            new: true
        }
    );

    if (!event) throw new apiError(404, "Event not found");

    return res.status(200).json(
        new apiResponse(200, event, "Cover image deleted")
    );
});



export {
    createNewEvent, 
    deleteEvent, 
    getEventDetails, 
    editEventDetails, 
    getAllEvents,
    updateCoverImg,
    deleteCoverImg,
    updateLogo,
    deleteLogo,
    updatePfpOC,
    deletePfpOC,
    updateSponsImg,
    deleteSponsImg,
}


/**
EVENT CONTROLLER: 
i. create new event DONE
ii. open registrations for users DONE
iii. close registrations for users DONE
iv. delete event
v. update event details
 */