import express  from "express";
import { getUsers, addUser, updateUser, deleteUser } from "../controllers/user.js";

const router = express.Router();

router.get("/u",getUsers);
router.post("/u",addUser);
router.put("/u:id",updateUser);
router.delete("/u:id",deleteUser);

export default router