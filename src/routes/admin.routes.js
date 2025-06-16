import { Router } from "express";
import { 
    adminReg, 
    adminLogin, 
    generateAccessAndRefreshToken, 
    adminLogout, 
    changeAdminPassword,
    getAdminDetails,
    updateAdminDetails,
    changePfp,
    refreshAccessToken} 
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
    router.route("/changepassword").post(verifyJWT,changeAdminPassword);
    router.route("/adminprofile").get(verifyJWT, getAdminDetails);
    router.route("/updateaccount").patch(verifyJWT, updateAdminDetails);
    router.route("/updatepfp").patch(verifyJWT,upload.single("pfp"),changePfp);
    router.route("/refreshtoken").post(refreshAccessToken)


export default router;