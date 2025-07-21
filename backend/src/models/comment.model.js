import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "eventRegister"
    },
    commentText: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        default: null,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
        default: null // null for top-level comments
    }
}, { timestamps: true })

export const Comment = mongoose.model("comments", commentSchema)