import { Router } from "express";

const router = Router();

router.route("/comment").post();
router.route("/comment/:eventId").get();

export default router;