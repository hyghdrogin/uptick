import { Router } from "express";
import UserController from "../controllers/userController";

const router = Router();
const { createUser, userLogin } = UserController;

router.post("/register", createUser);
router.post("/login", userLogin);

export default router;
