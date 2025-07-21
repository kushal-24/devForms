import { Router } from "express";
import {
    createNewEvent,
    deleteCoverImg,
    deleteEvent,
    deleteLogo,
    deletePfpOC,
    deleteSponsImg,
    editEventDetails,
    getAllEvents,
    getEventDetails,
    updateCoverImg,
    updateLogo,
    updatePfpOC,
    updateSponsImg
} from "../controllers/adminEvent.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { EventRegister } from "../models/eventRegister.model.js";
import { User } from "../models/user.model.js";

import { Admin } from "../models/admin.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import jwt from "jsonwebtoken";

const router = Router();

router.route("/createevent").post(
    upload.fields([
        {
            name: "pfpOC",
            maxCount: 3,
        },
        {
            name: "sponsImg",
            maxCount: 5,
        },
        {
            name: "coverImg",
            maxCount: 1,
        },
        {
            name: "logo",
            maxCount: 1,
        }
    ]), verifyJWT(["admin"]), createNewEvent)
router.route("/updatecoverimg/:eventTitle").patch(
    upload.fields([
        {
            name: "coverImg",
            maxCount: 1,
        }
    ])
    , verifyJWT(["admin"]), updateCoverImg)
router.route("/updatepfpoc/:eventTitle").patch(
    upload.fields([
        {
            name: "pfpOC",
            maxCount: 3,
        }
    ]), verifyJWT(["admin"]), updatePfpOC)
router.route("/updatelogo/:eventTitle").patch(
    upload.fields([
        {
            name: "logo",
            maxCount: 1,
        }
    ]), verifyJWT(["admin"]), updateLogo)
router.route("/updatesponsimg/:eventTitle").patch(
    upload.fields([
        {
            name: "sponsImg",
            maxCount: 5,
        }
    ]), verifyJWT(["admin"]), updateSponsImg)
router.route("/deleteevent/:eventTitle").delete(verifyJWT(["admin"]), deleteEvent)
router.route("/geteventdetails/:eventTitle").get(verifyJWT(["admin"]), getEventDetails)
router.route("/editeventdetails/:eventname").patch(verifyJWT(["admin"]), editEventDetails)
router.route("/getallevents").get(verifyJWT(["admin"]), getAllEvents)
router.route("/deletesponsimg/:eventTitle").delete(verifyJWT(["admin"]), deleteSponsImg)
router.route("/deletelogo/:eventTitle").delete(verifyJWT(["admin"]), deleteLogo)
router.route("/deletecoverimg/:eventTitle").delete(verifyJWT(["admin"]), deleteCoverImg)
router.route("/deletepfpoc/:eventTitle").delete(verifyJWT(["admin"]), deletePfpOC)



export default router;