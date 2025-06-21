import React, { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageRoutine = () => {

    const [routines, setRoutines] = useState([]);

    useEffect(() => {

        axios.get("http://localhost:8080/api/manage/routine/list")
        .then(res => setRoutines(res.data))
        .catch(err => alert("불러오기 실패: " + err.message));
    }, []);

    return (
        <div>
            <span>루틴목록 페이지</span>
        </div>
    );
};

export default ManageRoutine;   // export default로 컴포넌트 내보내기