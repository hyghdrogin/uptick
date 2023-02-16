import { Router } from "express";
import userRoutes from "./userRoutes";
import noteRoutes from "./noteRoutes";

const router = Router();

router.use("/user", userRoutes);
router.use("/note", noteRoutes);

export default router;
