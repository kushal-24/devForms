import { EventRegister } from '../models/eventRegister.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'

const registrationsStatus = asyncHandler(async (req, res, next) => {
    const { eventTitle } = req.body;

    const adminId = req.admin?._id;
    if (!adminId) {
        throw new apiError(400, "no admin found here sorry")
    }

    const event= await EventRegister.findOne({eventTitle, organisedBy: adminId});
    if(!event){
        throw new apiError(401,"no such event was found");
    }

    event.isRegistrationOpen = !event.isRegistrationOpen;
    await event.save();

    return res.status(200).json(
        new apiResponse(
            200,
            event,
            `Registration has been ${event.isRegistrationOpen ? "opened" : "closed"} successfully`
        )
    );
})


export { registrationsStatus }

/**
-->Verify that the request is from an admin (use your verifyJWT middleware).
-->Update the isRegistrationOpen or status field in the event document.
-->Send a response confirming the change.
 */