import { asyncHandler } from "../utils/asyncHandler.js"
import { apieError, apiError } from "../utils/apiError.js"
import { apiResponse } from "./utils/apiResponse.js"
import { Comment } from "../models/comment.model.js"
import { Admin } from "../models/admin.model.js"
import { User } from "../models/user.model.js"
import { EventRegister } from "../models/eventRegister.model.js"

const createComment = asyncHandler(async (req, res, next) => {
    const { commentText, eventId, parentCommentId } = req.body;

    if (!commentText || commentText === "") {
        throw new apiError(401, "no comment was entered");
    }

    const eventExists = await EventRegister.findById(eventId);
    if (!eventExists) {
        throw new apiError(404, "Event not found");
    }

    let userId = null;
    let adminId = null;

    if (req.user?._id) {
        userId = req.user._id;
    }
    if (req.admin?._id) {
        adminId = req.admin._id;
    }

    const createdComment = await Comment.create({
        commentText,
        eventId,
        parentCommentId: parentCommentId || null,
    })
    return res
        .status(200)
        .json(
            new apiResponse(
                201,
                createdComment,
                "Comment has been posted successfully"
            )
        )
});



const getCommentsById = asyncHandler(async (req, res, next) => {
    const{eventId}=req.params;

    const event= await EventRegister.findById({eventId});
    if(!eventId){
        throw new apiError(400,"no such events exist")
    }

    const allComments = await Comment.find({ eventId }).sort({ createdAt: 1 }, {commentText: 1},{userId: 1}).populate("userId", "fullName");
    /**
    This tells Mongoose: "Go to the user collection, find the document with that _id, 
    and replace userId with the user’s fullName field."
    */

});

export { createComment, getCommentsById }