import { Hono } from "hono";
import { createNote, getAllNotes, getNoteById, deleteNote, updateNote } from "../controllers/note.controller";
import { protect } from "../middlewares/auth.middleware";
const router = new Hono();



router.get("/",protect, getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;