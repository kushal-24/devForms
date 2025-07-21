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
import { registrationsStatus } from "../controllers/regToggle.controller.js";
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
    router.route("/logout").post(verifyJWT(["admin"]),adminLogout);
    router.route("/changepassword").post(verifyJWT(["admin"]),changeAdminPassword);
    router.route("/adminprofile").get(verifyJWT(["admin"]), getAdminDetails);
    router.route("/updateaccount").patch(verifyJWT(["admin"]), updateAdminDetails);
    router.route("/updatepfp").patch(verifyJWT(["admin"]),upload.single("pfp"),changePfp);
    router.route("/refreshtoken").post(refreshAccessToken);
    router.route("/regtoggle").post(verifyJWT(["admin"]), registrationsStatus);


export default router;