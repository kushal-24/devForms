import { Router } from "express";
import { adminReg } from "../controllers/admin.controller.js";

const router= Router();

router.route("/register").post(adminReg);

export default router;