import express from "express";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use("/", taskRoutes);

app.listen(8800);