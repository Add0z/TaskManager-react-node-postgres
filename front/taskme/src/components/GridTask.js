import React, {useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {FaTrash, FaEdit, FaPlus, FaTasks, FaCheck, FaUser} from "react-icons/fa";
import { toast } from "react-toastify";
import {FaTicket} from "react-icons/fa6";
import Dropdown from "react-dropdown";
import {TbRadar2} from "react-icons/tb";

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

export const Tbody = styled.tbody`
    margin-top: 50px;
`;

export const StyledDropdown = styled(Dropdown)`
    width: 150px;
    `;

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







const GridTask = ({ task, setTask, setTaskOnEdit ,taskOnEdit}) => {


    const [AvailableDefaultOptionSupport] = 'Support';
    const [AvailableDefaultOptionTRAINEE] = 'Traine';
    const [AvailableDefaultOptionLEAD] = 'Task Lead';

    const [options, setOptions] = useState([]);

    const saveAfterDropdownChange = async (taskId,updateField) => {
        await axios
            .put("http://localhost:8800/m" + taskId, updateField)
            .then(({ data }) => {
                toast.success(data);
            })
            .catch(({ data }) => toast.error(data));

        setTaskOnEdit(null);
    };

    const handleAvailableSupport = async (selectedOption,taskId) => {

        let updateField = {
            "update-field": "Support 1",
            "Support 1": selectedOption.value
        }
        await saveAfterDropdownChange(taskId,updateField);
    };

    const handleAvailableTRAINEE = async (selectedOption,taskId) => {
        let updateField = {
            "update-field": "Trainee",
            "Trainee": selectedOption.value
        }
        await saveAfterDropdownChange(taskId,updateField);
    };

    const handleAvailableLEAD = async (selectedOption,taskId) => {
        let updateField = {
            "update-field": "Task Lead",
            "Task Lead": selectedOption.value
        }
        await saveAfterDropdownChange(taskId,updateField);
    };


    const fetchDropdownOptions = async () => {
        try {
            const resTask = await axios.get("http://localhost:8800/m");
            const options = resTask.data.map((option) => option.name);
            setOptions(options);
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        fetchDropdownOptions();
    }, []);


    const handleEdit = (item) => {
        setTaskOnEdit(item);
    };

    const handleFinish = async (id) => {
        await axios
            .put("http://localhost:8800/f" + id, { status: "Finished" })
            .then(({ data }) => {
                const newArray = task.filter((task) => task["ID"] !== id);
                setTask(newArray);
                toast.success(data);
            })
            .catch(({ data }) => toast.error(data));

        setTaskOnEdit(null);
    };


    const handleDelete = async (id) => {

        await axios
            .delete("http://localhost:8800/t" + id)
            .then(({ data }) => {
                const newArray = task.filter((task) => task["ID"] !== id);
                setTask(newArray);
                toast.success(data);
            })
            .catch(({ data }) => toast.error(data));

        setTaskOnEdit(null);
    };

    function nomeInicial(inicial) {
        // console.log(inicial);
        if (inicial !== null && inicial !== "null" && inicial !== undefined && inicial !== "undefined") {
           return inicial;
        } else {
            return false;
        }


    }

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Title</Th>
                    <Th onlyWeb>Description</Th>
                    <Th alignCenter={"right"}>Priority</Th>
                    <Th>Due Date</Th>
                    <Th></Th>

                    <Th>Status</Th>
                    <Th></Th>
                    <Th></Th>
                    <Th></Th>

                    <Th></Th>
                </Tr>
            </Thead>
            <Tbody>
                {task && task.map((item, i) => {
                    // Perform your logic here to set initial states based on item
                    const initialSupport = nomeInicial(item["Support 1"]);
                    const initialTrainee = nomeInicial(item["Trainee"]);
                    const initialLead = nomeInicial(item["Task Lead"]);

                    return (
                        <Tr key={i}>
                        <Td width="8.9%">{item.title}</Td>
                        <Td width="15%" onlyWeb>
                            {item.description}
                        </Td>
                        <Td width="8%">{item.priority}</Td>
                        <Td width="11%">
                            {new Date(item.due_date).toLocaleDateString('en-GB')}
                        </Td>

                            <Td width="8%">{item.status}</Td>

                            <Td alignCenter width="5%">
                            <FaEdit onClick={() => handleEdit(item)} />
                        </Td>
                        <Td alignCenter width="5%">
                            <FaTrash onClick={() =>  handleDelete(item["ID"])} />
                        </Td>
                        <Td alignCenter width="5%">
                            <FaCheck onClick={() => handleFinish(item["ID"])} />
                        </Td>
                            <Td vertical-Align="bottom" height= "50px" width="100%" colSpan="3"> {/* Use colSpan to span the full width of the three dropdowns */}
                                    {/*<label style={{marginRight: '10px'}}>Available</label>*/}
                                    <StyledDropdown
                                        options={Array.isArray(options) ? options : []}
                                        onChange={(selectedOption) => handleAvailableLEAD(selectedOption, item["ID"])}
                                        value={initialLead ? initialLead : null}
                                        priority={initialLead}
                                        placeholder="Task Lead"
                                    />
                                    {/*<label style={{marginRight: '10px'}}>Available</label>*/}
                                    <StyledDropdown
                                        options={Array.isArray(options) ? options : []}
                                        onChange={(selectedOption) => handleAvailableSupport(selectedOption, item["ID"])}
                                        value={initialSupport ? initialSupport : null}
                                        priority={initialSupport}
                                        placeholder="Support"
                                    />
                                    {/*<label style={{marginRight: '10px'}}>Available</label>*/}
                                    <StyledDropdown
                                        options={Array.isArray(options) ? options : []}
                                        onChange={(selectedOption) => handleAvailableTRAINEE(selectedOption, item["ID"])}
                                        value={initialTrainee ? initialTrainee : null}
                                        priority={initialTrainee}
                                        placeholder="Trainee"
                                    />
                            </Td>
                        </Tr>

                    );
                })}
            </Tbody>
        </Table>
    );
};

export default GridTask;