import { Router } from "express";
import { adminReg } from "../controllers/admin.controller.js";
import { Admin } from "../models/admin.model.js";

const router= Router();
import { upload } from "../middlewares/multer.middleware.js";

router.route("/register").post(
    upload.fields([
        {
            name: "pfp",
            maxCount: 1,
        },
        {},
    ]),
    adminReg);

export default router;