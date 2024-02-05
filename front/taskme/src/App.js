import GlobalStyle from "./styles/global";
import styled from "styled-components";
import Form from "./components/Form.js";
import FormTask from "./components/FormTask.js";
import Grid from "./components/Grid";
import GridTask from "./components/GridTask.js";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import GridTaskClosed from "./components/GridTaskClosed";

const Container = styled.div`
    width: 50000px;
    max-width: 50000px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

const Title = styled.h2``;



const BaixoDireita = styled.div`
    flex: 1; /* Take up remaining space */
`;

const BaixoEsquerda = styled.div``;



function App() {
    const [users, setUsers] = useState([]);
    const [task, setTask] = useState([]);
    const [taskClosed, setTaskClosed] = useState([]);

    const [onEdit, setOnEdit] = useState(null);
    const [taskOnEdit, setTaskOnEdit] = useState(null);
    const [ClosedOnEdit, setClosedOnEdit] = useState(null);

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8800/u");
            setUsers(res.data.sort((a, b) => (a.name > b.name ? 1 : -1)));

        } catch (error) {
            toast.error(error);
        }
    };

    const getTasks = async () => {
        try {
            const resTask = await axios.get("http://localhost:8800/t");
            setTask(resTask.data);
        } catch (error) {
            toast.error(error);
        }
    };

    const getTasksClosed = async () => {
        try {
            const resClosed = await axios.get("http://localhost:8800/tc");
            setTaskClosed(resClosed.data);
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        getUsers();
        getTasks();
        getTasksClosed();
    }, [setUsers, setTask, setTaskClosed]);



    return (
        <>
            <Container>
                <div className="parent">
                    <div className="div1"><Title>TaskMe!</Title></div>
                    <div className="div2">
                        <div className="Cima">
                            <FormTask taskOnEdit={taskOnEdit} setTaskOnEdit={setTaskOnEdit} getTasks={getTasks}/>
                            <GridTask setTaskOnEdit={setTaskOnEdit} task={task} setTask={setTask}/>
                        </div>
                    </div>
                    <div className="div3"><BaixoDireita>
                        <h3>Finished</h3>
                        <GridTaskClosed setClosedOnEdit={setClosedOnEdit} taskClosed={taskClosed}
                                        setTaskClosed={setTaskClosed}/>
                    </BaixoDireita></div>
                    <div className="div4"><BaixoEsquerda>
                        <h3>Users</h3>
                        <Form onEdit={onEdit} setOnEdit={setOnEdit} getUsers={getUsers}/>
                        <Grid setOnEdit={setOnEdit} users={users} setUsers={setUsers}/>
                    </BaixoEsquerda></div>
                </div>
            </Container>
            <ToastContainer autoClose={3000}/>
            <GlobalStyle/>
        </>
    );
}

export default App;
