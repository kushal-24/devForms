import mongoose, { Schema } from "mongoose";

const fillFormSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: "EventRegister"
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNo: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    status: {
        type: String,
        required: true
        // example: "student", "professional", etc.
    },
    location: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["student","professional"],
        required: true
        // example: "participant", "organizer", "mentor"
    },
    passingoutYear: {
        type: Number,
        default: null,
    },
    course: {
        type: String,
        default: null,
    },
    company: {
        type: String,
        default: null
    }
}, { timestamps: true });



export const FillForm = mongoose.model("fillforms", fillFormSchema);
