import mongoose, { Schema } from "mongoose";

const eventRegisterSchema = new Schema({
    eventTitle: {
        type: String,
        required: true
    },
    organisedBy: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["online", "offline", "hybrid"],//cool
        required: true
    },
    coverImg: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
    themeTags: {
        type: [String], // array of tags like ["AI", "Blockchain"]
        required: true
    },
    registrationsStart: {
        type: Date,
        required: true
    },
    registrationsDeadline: {
        type: Date,
        required: true
    },

    eventStarts: {
        type: Date,
        required: true
    },

    eventEnds: {
        type: Date,
        required: true
    },
    aboutEvent: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prizePool: {
        type: String, // or Number if you want to store as a fixed amount
        required: true
    },
    sponsorsImg: {
        type: [String], // array of sponsor image URLs
        default: [""]
    },
    teamSize: {
        type: Number,
        required: true
    },
    contactOC: {
        type: String, // email or phone or both
        required: true
    },
    registeredPeople: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    
}, { timestamps: true });

export const eventRegister = mongoose.model("eventRegister", eventRegisterSchema)