import React from "react";
import axios from "axios";
import styled from "styled-components";
import {FaTrash, FaEdit, FaPlus, FaTasks, FaCheck, FaUser} from "react-icons/fa";
import { toast } from "react-toastify";
import {FaTicket} from "react-icons/fa6";

const Table = styled.table`
    width: 100%;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0px 0px 5px #ccc;
    border-radius: 5px;
    //max-width: 2000px;
    margin: 10px 0px;  /* Center the table horizontally */
    word-break: break-all;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th`
    text-align: start;
    border-bottom: inset;
    padding-bottom: 5px;

    @media (max-width: 500px) {
        ${(props) => props.onlyWeb && "display: none"}
    }
`;

export const Td = styled.td`
    padding-top: 15px;
    text-align: ${(props) => (props.alignCenter ? "center" : "start")};
    width: ${(props) => (props.width ? props.width : "auto")};

    @media (max-width: 500px) {
        ${(props) => props.onlyWeb && "display: none"}
    }
`;

const GridTaskClosed = ({ taskClosed, setTaskClosed, setClosedOnEdit ,taskOnEdit}) => {
    // console.log("setTaskClosed "  + setTaskClosed)
    // console.log("taskClosed " + taskClosed);
    // console.log("setClosedOnEdit " + setClosedOnEdit);
    const handleEdit = (item) => {
        setClosedOnEdit(item);
    };

    const handleFinish = async (id) => {
        try {
            await axios.put("http://localhost:8800/t" + id, { status: "Finished" });
            toast.success("Status updated successfully");
        } catch (error) {
            toast.error("Error updating status");
        }
    };


    const handleDelete = async (id) => {
        await axios
            .delete("http://localhost:8800/t" + id)
            .then(({ data }) => {
                const newArray = taskClosed.filter((task) => task.id !== id);

                setTaskClosed(newArray);
                toast.success(data);
            })
            .catch(({ data }) => toast.error(data));

        setClosedOnEdit(null);
    };

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Title</Th>
                    <Th onlyWeb>Description</Th>
                    <Th alignCenter={"right"}>Priority</Th>
                    <Th>Due Date</Th>
                    <Th >Task Lead</Th>
                    <Th></Th>
                    <Th></Th>
                </Tr>
            </Thead>
            <Tbody>
                {taskClosed && taskClosed.map((item, i) => (
                    <Tr key={i}>
                        <Td width="12%">{item.title}</Td>
                        <Td width="15%" onlyWeb>
                            {item.description}
                        </Td>
                        <Td width="6%">{item.priority}</Td>
                        <Td width="9%">
                            {new Date(item.due_date).toLocaleDateString('en-GB')}
                        </Td>
                        <Td width="9%">{item["Task Lead"]}</Td>
                        <Td alignCenter width="3%">
                            <FaEdit onClick={() => handleEdit(item)} />
                        </Td>
                        <Td alignCenter width="3%">
                            <FaTrash onClick={() => handleDelete(item.id)} />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default GridTaskClosed;