import React, { useEffect,useRef} from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";


const FormContainer = styled.form`
    display: flex;
    width: 100%;
    align-items: flex-end;
    gap: 10px;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #ccc;
    `;

const InputArea = styled.div` 
    display: flex;
    flex-direction: column;
    `;

const Input = styled.input`
    width: 290px;
    padding: 0 10px;
    border: 1px solid #bbb;
    border-radius: 5px;
    height: 40px;
    `;

const InputDate = styled.input`
    width: 200px;
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

const Form = ({onEdit, setOnEdit, getUsers}) => {

    const ref = useRef();

    useEffect(() => {
        if (onEdit) {
            const user = ref.current;

            user.name.value = onEdit.name;
            user.email.value = onEdit.email;
            user.phone.value = onEdit.phone;
            user.birthdate.value = onEdit.birthdate;

        }
    }, [onEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = ref.current;

        if (
            !user.name.value ||
            !user.email.value ||
            !user.phone.value ||
            !user.birthdate.value
        ) {
            return toast.warn("Missing Fields");

        }
        const formattedDate = new Date(user.birthdate.value).toISOString().split('T')[0];


        if (onEdit) {
               await axios
                .put("http://localhost:8800/u" + onEdit["ID"], {
                    name: user.name.value,
                    email: user.email.value,
                    phone: user.phone.value,
                    birthdate: formattedDate
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        } else {
            await axios
                .post("http://localhost:8800/u", {
                    name: user.name.value,
                    email: user.email.value,
                    phone: user.phone.value,
                    birthdate: user.birthdate.value
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data));
        }

        user.name.value = "";
        user.email.value = "";
        user.phone.value = "";
        user.birthdate.value = "";

        setOnEdit(null);
        getUsers();
    }


    return (
        <FormContainer ref={ref} onSubmit={handleSubmit}>
            <InputArea>
                <Label>Name</Label>
                <Input name="name"/>
            </InputArea>
            <InputArea>
                <Label>Email</Label>
                <Input name="email" type="email"/>
            </InputArea>
            <InputArea>
                <Label>Phone</Label>
                <Input name="phone"/>
            </InputArea>
            <InputArea>
                <Label>Birthdate</Label>
                <Input name="birthdate" type="date"/>
            </InputArea>

            <Button type="submit">Save</Button>
        </FormContainer>
    );
}

export default Form