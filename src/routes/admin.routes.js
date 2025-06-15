import { Router } from "express";
import { 
    adminReg, 
    adminLogin, 
    generateAccessAndRefreshToken, 
    adminLogout } 
    from "../controllers/admin.controller.js";
import { Admin } from "../models/admin.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
    router.route("/login").post(adminLogin);
    router.route("/logout").post(verifyJWT,adminLogout);

export default router;