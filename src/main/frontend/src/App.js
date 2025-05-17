import logo from './logo.svg';
import './App.css';
// 2025.01.26 Axios 라이브러리 설치
import {useEffect, useState} from "react";
import axios from "axios";
//const cors = require('cors')

//app.use(cors({ credentials: true, origin: "http://localhost:8080" }));

function App() {

    const [hello, setHello] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/api/test')
            .then((res) => {
                console.log("res ? " + res);
                setHello(res.data);
            })
            .catch((err) => {
              setError(err.message);
            });
    }, []);
    return (
        <div className="App">
            백엔드에서 받은 데이터: {hello}
            {error && <p>Error: {error}</p>}
        </div>
    );
    /*
    return (
        <div className="App">
                <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
  */
}

export default App;
