import React, {useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {FaTrash, FaEdit, FaPlus, FaTasks, FaCheck, FaUser} from "react-icons/fa";
import { toast } from "react-toastify";
import {FaTicket} from "react-icons/fa6";
import Dropdown from "react-dropdown";
import {TbRadar2} from "react-icons/tb";

const Table = styled.table`
    width: 1300px;
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

            const noRepeatMembers = async (item, taskId, updateField) => {

                if (item["Support 1"].value === null){
                    item["Support 1"].value = "Support nulo"
                }
                if (item["Trainee"].value === null){
                    item["Trainee"].value = "Trainee nulo"
                }
                if (item["Task Lead"].value === null){
                    item["Task Lead"].value = "Task Lead nulo"
                }

                console.log(item["Support 1"])
                console.log(updateField[updateField["update-field"]] !== item["Support 1"])

                if (updateField[updateField["update-field"]] !== item["Support 1"] &&
                    updateField[updateField["update-field"]] !== item["Trainee"] &&
                    updateField[updateField["update-field"]] !== item["Task Lead"] &&
                    item["Support 1"] !== item["Trainee"] &&
                    item["Support 1"] !== item["Task Lead"] &&
                    item["Trainee"] !== item["Task Lead"]) {
                    await saveAfterDropdownChange(taskId, updateField);
                } else {
                    toast.error("Repeat members are not allowed");
                }
            };
            const handleAvailableSupport = async (selectedOptionSupport, item) => {
                var taskId = item["ID"]

                if (selectedOptionSupport.value === "REMOVE"){
                    selectedOptionSupport.value = null
                }
                let updateField = {
                    "update-field": "Support 1",
                    "Support 1": selectedOptionSupport.value
                }
                await noRepeatMembers(item,taskId, updateField);
            };

            const handleAvailableTRAINEE = async (selectedOptionTrainee, item) => {
                var taskId = item["ID"]
                if (selectedOptionTrainee.value === "REMOVE"){
                    selectedOptionTrainee.value = null
                }
                let updateField = {
                    "update-field": "Trainee",
                    "Trainee": selectedOptionTrainee.value
                }
                await noRepeatMembers(item,taskId, updateField);
            };

            const handleAvailableLEAD = async (selectedOptionLead, item) => {
                var taskId = item["ID"]
                if (selectedOptionLead.value === "REMOVE"){
                    selectedOptionLead.value = null
                }
                let updateField = {
                    "update-field": "Task Lead",
                    "Task Lead": selectedOptionLead.value
                }
                await noRepeatMembers(item,taskId, updateField);
            };




        const saveAfterDropdownChange = async (taskId,updateField) => {
            await axios
                .put("http://localhost:8800/m" + taskId, updateField)
                .then(({ data }) => {
                    toast.success(data);
                })
                .catch(({ data }) => toast.error(data));
            fetchDropdownOptions();
            setTaskOnEdit(null);
        };




    const fetchDropdownOptions = async () => {
        try {
            const resTask = await axios.get("http://localhost:8800/m");
            const options = resTask.data.map((option) => option.name);
             options.unshift("REMOVE");
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

    // TODO: check for more than 3 tasks in one name

    return (
     <>
         <Table>
             <Thead>
                 <Tr>
                     <Th width="15%" title={'Title'} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>Title</Th>
                     <Th width="30%" onlyWeb style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>Description</Th>
                     <Th width="8%" title={'Priority'} alignCenter={"right"} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>Priority</Th>
                     <Th width="10%" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>Due Date</Th>
                     <Th width="8%" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>Task Lead</Th>
                     <Th width="8%" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>Support</Th>
                     <Th width="8%" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0 }}>Trainee</Th>
                     <Th width="12%" style={{ marginLeft: "30px", paddingLeft: "15px" }}>Status</Th>
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
                             <Td>{item.title}</Td>
                             <Td onlyWeb>
                                 {item.description}
                             </Td>
                             <Td>{item.priority}</Td>
                             <Td>
                                 {new Date(item.due_date).toLocaleDateString('en-GB')}
                             </Td>
                             <Td style={{ verticalAlign: "middle" }}>
                                 <StyledDropdown
                                     options={Array.isArray(options) ? options : []}
                                     onChange={(selectedOptionLead) => handleAvailableLEAD(selectedOptionLead, item)}
                                     value={initialLead ? initialLead : null}
                                     priority={initialLead}
                                     placeholder="Task Lead"
                                 />
                             </Td>
                             <Td style={{ verticalAlign: "middle" }}>
                                 <StyledDropdown
                                     options={Array.isArray(options) ? options : []}
                                     onChange={(selectedOptionSupport) => handleAvailableSupport(selectedOptionSupport, item)}
                                     value={initialSupport ? initialSupport : null}
                                     priority={initialSupport}
                                     placeholder="Support"
                                 />
                             </Td>
                             <Td style={{ verticalAlign: "middle" }}>
                                 <StyledDropdown
                                     options={Array.isArray(options) ? options : []}
                                     onChange={(selectedOptionTrainee) => handleAvailableTRAINEE(selectedOptionTrainee, item)}
                                     value={initialTrainee ? initialTrainee : null}
                                     priority={initialTrainee}
                                     placeholder="Trainee"
                                 />
                             </Td>
                             <Td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 0, paddingLeft: "20px" }}>{item.status}</Td>
                             <Td alignCenter width="3%">
                                 <FaEdit onClick={() => handleEdit(item)} />
                             </Td>
                             <Td alignCenter width="3%">
                                 <FaTrash onClick={() => handleDelete(item["ID"])} />
                             </Td>
                             <Td alignCenter width="3%">
                                 <FaCheck onClick={() => handleFinish(item["ID"])} />
                             </Td>
                         </Tr>
                     );
                 })}
             </Tbody>
         </Table>
         </>
    );
};

export default GridTask;