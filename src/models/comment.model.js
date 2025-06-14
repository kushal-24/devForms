import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema= new Schema({
    hackathonName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "eventRegister"
    },
    commentData: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null,
    },
    aadminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        default: null,
    },
},{timestamps: true})

export const Comment= mongoose.model("comments", commentSchema)