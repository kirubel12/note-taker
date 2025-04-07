import { Hono } from "hono";
import { createNote, getAllNotes, getNoteById, deleteNote, updateNote } from "../controllers/note.controller";
import { protect } from "../middlewares/auth.middleware";
const router = new Hono();



router.get("/",protect, getAllNotes);
router.get("/:id",protect, getNoteById);
router.post("/", protect,createNote);
router.put("/:id", protect,updateNote);
router.delete("/:id", protect,deleteNote);

export default router;