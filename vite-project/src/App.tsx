
import './App.css'
import {useState} from "react";
import axios from 'axios';

function App() {

    const [random, setRandom] = useState(0);

    const buttonAction = async() => {
        const response = await axios.get("/api")
        setRandom(response.data)
    }
    return (
        <>
            랜덤 값은 {random} 입니다!
            <br/>
            <button onClick={buttonAction}>랜덤 재설정!</button>
        </>
    )
}

export default App
