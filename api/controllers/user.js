

import { pool} from "../db.cjs";

export const getUsers = async (_, res) => {
    try {
        const result = await pool.query("select * from \"User\"");

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addUser = async (req, res) => {
    try{
        const result = await pool.query("insert into \"User\" (name, email, phone, birthdate) values ($1, $2, $3, $4)", [req.body.name, req.body.email, req.body.phone, req.body.birthdate]);
        return res.status(200).json("User added successfully");
    }
    catch(error){
        console.error("Error adding user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUser = async (req, res) => {
    try{
        const result = await pool.query("update \"User\" set name=$1, email=$2, phone=$3, birthdate=$4 where \"ID\"=$5", [req.body.name, req.body.email, req.body.phone, req.body.birthdate, req.params.id.replace( ":", "")]);
        return res.status(200).json("User updated successfully");
    }
    catch(error){
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteUser = async (req, res) => {
    try{
        const result = await pool.query("delete from \"User\" where \"ID\"=$1", [req.params.id.replace( ":", "")]);
        return res.status(200).json("User deleted successfully");
    }
    catch(error){
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}