
import axios from "axios";
import {pool} from "../db.cjs";

export const getTasks = async (_, res) => {
    try {
        const result = await pool.query("select * from tasks where status not in ('Finished', 'Deleted') order by created_at desc");

        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addTasks = async (req, res) => {
    try {
        const created_at = new Date().toISOString();
        const updated_at = null;
        const result = await pool.query("INSERT INTO tasks (title, description, due_date, \"Task Lead\", \"Support 1\", \"Trainee\", priority, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TO_TIMESTAMP($9, 'YYYY-MM-DDTHH24:MI:SS.MSZ'), $10)", [
            req.body.title,
            req.body.description,
            req.body.due_date,
            req.body["Task Lead"],
            req.body["Support 1"],
            req.body["Trainee"],
            req.body.priority,
            req.body.status,
            created_at,
            updated_at,
        ]);

        return res.status(200).json("Tasks added successfully");
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addTasksMember = async (req, res) => {
    try {
        const taskId = req.params.id.replace(":", "");

        const existingTask = await pool.query("SELECT * FROM tasks WHERE \"ID\" = $1", [taskId]);

        if (existingTask.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        let updateField;


        if (req.body["update-field"] === "Task Lead") {
            updateField = "\"Task Lead\"";
        } else if (req.body["update-field"] === "Support 1") {
            updateField = "\"Support 1\"";
        } else if (req.body["update-field"] === "Trainee") {
            updateField = "\"Trainee\"";
        } else {
            return res.status(400).json({ error: "Invalid or missing 'update-field' header" });
        }

        // Check if the specified field is allowed to be updated (prevent updating fields that should not be the same)
        if (
            (updateField === "\"Task Lead\"" && req.body[updateField] === existingTask.rows[0]["Support 1"]) ||
            (updateField === "\"Support 1\"" && req.body[updateField] === existingTask.rows[0]["Task Lead"]) ||
            (updateField === "\"Trainee\"" && req.body[updateField] === existingTask.rows[0]["Task Lead"])
        ) {
            return res.status(400).json({ error: `${updateField} cannot be the same as other fields` });
        }
        const updated_at = new Date().toISOString();  // Use ISO format for timestamp
        const result = await pool.query(
            `UPDATE tasks SET ${updateField}=$1, updated_at=TO_TIMESTAMP($2, 'YYYY-MM-DDTHH24:MI:SS.MSZ') WHERE \"ID\"=$3`,
            [
                req.body[req.body["update-field"]],
                updated_at,
                taskId,
            ]
        );

        return res.status(200).json("Tasks updated successfully");
    } catch (error) {
        console.error("Error updating Tasks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const updateTasks = async (req, res) => {
    try{
        const updated_at = new Date().toISOString();
        const result = await pool.query("update tasks set title=$1, description=$2, due_date=$3, priority=$4, status=$5,  updated_at=TO_TIMESTAMP($6, 'YYYY-MM-DDTHH24:MI:SS.MSZ') where \"ID\"=$7",
            [
                req.body.title,
                req.body.description,
                req.body.due_date,
                req.body.priority,
                req.body.status,
                updated_at,
                req.params.id.replace(":", ""),
            ]);

        return res.status(200).json("Tasks updated successfully");
    }
    catch(error){
        console.error("Error updating Tasks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteTasks = async (req, res) => {
    try{
        const updated_at = new Date().toISOString();
        const result = await pool.query("update tasks set status='Deleted', updated_at=TO_TIMESTAMP($1, 'YYYY-MM-DDTHH24:MI:SS.MSZ') where \"ID\"=$2",
            [ updated_at,req.params.id.replace(":", "")]);
        return res.status(200).json("Tasks deleted successfully");
    }
    catch(error){
        console.error("Error deleting Tasks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const AvailableMembers = async (_, res) => {
    try {
        const users =  (await axios
            .get("http://localhost:8800/u")).data
        const AvailableMembers = [];

        for (const user of users) {
            try {
                const result = await pool.query("select * from tasks where (\"Task Lead\" = $1 or \"Support 1\" = $1 or \"Trainee\" = $1) and (\"status\" not in ('Finished', 'Deleted')) ", [user.name]);
                if (result.rowCount < 3) {
                    AvailableMembers.push(user);
                }
            } catch (error) {
                console.error("Error executing query:", error);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        }

        return res.status(200).json(AvailableMembers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getTasksClosed = async (_, res) => {
    try {
        const result = await pool.query("select * from tasks where status in ('Finished', 'Deleted') order by created_at desc");

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching Tasks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const finishTasks = async (req, res) => {
    try{
        const updated_at = new Date().toISOString();
        console.log(req.body.status)
        console.log(updated_at)
        console.log(req.params.id)
        const result = await pool.query("update tasks set status=$1, updated_at=TO_TIMESTAMP($2, 'YYYY-MM-DDTHH24:MI:SS.MSZ') where \"ID\"=$3",
            [
                req.body.status,
                updated_at,
                req.params.id.replace(":", ""),
            ]);

        return res.status(200).json("Tasks updated successfully");
    }
    catch(error){
        console.error("Error updating Tasks:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}