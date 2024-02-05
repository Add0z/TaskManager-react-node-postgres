import express  from "express";
import {
    getTasks,
    addTasks,
    updateTasks,
    deleteTasks,
    addTasksMember,
    AvailableMembers,
    getTasksClosed,
    finishTasks
} from "../controllers/tasks.js";

const router = express.Router();

router.get("/t",getTasks);
router.get("/tc",getTasksClosed);
router.get("/m",AvailableMembers);
router.post("/t",addTasks);
router.put("/t:id",updateTasks);
router.put("/f:id",finishTasks);
router.put("/m:id",addTasksMember);
router.delete("/t:id",deleteTasks);


export default router