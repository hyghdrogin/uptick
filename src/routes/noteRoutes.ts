import { Router } from "express";
import NoteController from "../controllers/noteController";
import Authentication from "../middlewares/authentication";

const router = Router();
const { authenticate } = Authentication;
const {
  createNote, readNote, getAllNotes, updateNote, deleteNote
} = NoteController;

router.post("/create", authenticate, createNote);

router.get("/:noteId", authenticate, readNote);
router.get("/", authenticate, getAllNotes);

router.patch("/:noteId", authenticate, updateNote);

router.delete("/:noteId", authenticate, deleteNote);

export default router;
