import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const FormContainer = styled.form`
    width: 100%;
    display: flex;
    align-items: flex-end;
    gap: 10px;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 20px;
    margin: 10px auto;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #ccc;
`;

const InputArea = styled.div`
    
    display: flex;
    flex-direction: column;
`;

const DescriptionInput = styled.input`
    width: 350px;
    padding: 0 10px;
    border: 1px solid #bbb;
    border-radius: 5px;
    height: 40px;
`;

const Input = styled.input`
    width: 120px;
    padding: 0 10px;
    border: 1px solid #bbb;
    border-radius: 5px;
    height: 40px;
`;

const Label = styled.label``;


const Button = styled.button`
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: ${props => props.primary ? "blue" : "red"};
    color: white;
    height: 42px;
`;

const priority = ['Low', 'Medium', 'High'];

const status = ['Open', 'In Progress', 'Finished', 'On Hold', 'Deleted'];



const FormTask = ({ taskOnEdit, setTaskOnEdit, getTasks }) => {
    const ref = useRef();

    useEffect(() => {
        if (taskOnEdit) {
            const task = ref.current;
            task.title.value = taskOnEdit.title;
            task.description.value = taskOnEdit.description;
            task.due_date.value = taskOnEdit.due_date;
            task["Task Lead"] = taskOnEdit["Task Lead"];
            task["Support 1"] = taskOnEdit["Support 1"];
            task["Trainee"] = taskOnEdit["Trainee"];
            task.priority = taskOnEdit.priority;
            task["Status"] = taskOnEdit["Status"];
            task.created_at = taskOnEdit.created_at;
        }
    }, [taskOnEdit]);

    const [priorityDefaultOption, setPriorityDefaultOption] = useState('Low');
    const [statusDefaultOption, setStatusDefaultOption] = useState('Open');

    const handlePrioritySelect = (selectedOption) => {
        setPriorityDefaultOption(selectedOption);
    };

    const handleStatusSelect = (selectedOption) => {
        setStatusDefaultOption(selectedOption);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const task = ref.current;

        if (
            !task.title.value ||
            !task.description.value ||
            !task.due_date.value ||
            !statusDefaultOption ||
            !priorityDefaultOption.value
        ) {

            return toast.warn("Title, Description, Due Date, Priority, Status are required");
        }

        if (taskOnEdit) {
                await axios
                .put("http://localhost:8800/t" + taskOnEdit["ID"], {
                    title: task.title.value,
                    description: task.description.value,
                    due_date: task.due_date.value,
                    priority: priorityDefaultOption.value,
                    "status": statusDefaultOption
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        } else {
            await axios
                .post("http://localhost:8800/t", {
                    title: task.title.value,
                    description: task.description.value,
                    due_date: task.due_date.value,
                    priority: priorityDefaultOption.value,
                    "status": statusDefaultOption.value
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));

        }

        task.title.value = "";
        task.description.value = "";
        task.due_date.value = "";
        task.priority = "";
        task["Status"]= "";

        setTaskOnEdit(null);
        getTasks();

    };

    return (
        <FormContainer ref={ref} onSubmit={handleSubmit}>
            <InputArea>
                <Label>Title</Label>
                <Input name="title" />
            </InputArea>
            <InputArea>
                <Label>Description</Label>
                <DescriptionInput name="description" />
            </InputArea>
            <InputArea>
                <Label>Due Date</Label>
                <Input name="due_date" type="date" />
            </InputArea>
            <Dropdown
                options={priority}
                onChange={handlePrioritySelect}
                value={priorityDefaultOption}
                priority={priorityDefaultOption}
                placeholder="Priority"
                controlStyle={{ width: '130px' }}

            />
                <Dropdown
                    options={status}
                    onChange={handleStatusSelect}
                    value={statusDefaultOption}
                    status={statusDefaultOption}
                    placeholder="Status"
                    controlStyle={{ width: '100px' }}

                />
            <Button type="submit">Save</Button>
        </FormContainer>
    );
};

export default FormTask;
