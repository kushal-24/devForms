import { Router } from "express";
import { createNewEvent } from "../controllers/event.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { EventRegister } from "../models/eventRegister.model.js";
import { User } from "../models/user.model.js";

import { Admin } from "../models/admin.model.js";
import { upload } from "../middlewares/multer.middleware.js";

const router= Router();

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
    ]),createNewEvent)

    export default router;