import { createContext } from 'react';
import { useEffect, useState } from 'react';

const Context = createContext();

function ContextProvider({ children }) {
    const [listSchoolYear, setListSchoolYear] = useState([])
    const [listPosition, setListPosition] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [account, setAccount] = useState(null);
    const [listNameFile, setListNameFile] = useState([])
    const [showLoading, setShowLoading] = useState(false);
    const [schoolYearMax, setSchoolYearMax] = useState(null);
    //const []
    const styleStatus = (row) => {
        if (row.researchStatusName === "Khởi tạo") {
            return {
                background: '#ffadad8f',
                color: 'red',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600"
            }
        }
        else if (row.researchStatusName === "Chờ duyệt") {
            return {
                background: '#59bfff',
                color: 'white',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600"
            }
        }
        else if (row.researchStatusName === "Đã được duyệt") {
            return {
                background: '#c828288f',
                color: 'blue',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600",
            }
        }
        else if (row.researchStatusName === "Chỉnh sửa") {
            return {
                background: '#bcbf1b8f',
                color: 'white',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600",
            }
        }
        else if (row.researchStatusName === "Đã từ chối") {
            return {
                background: '#fb0303',
                color: 'white',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600",
            }
        }
        else if (row.researchStatusName === "Đã chỉnh sửa") {
            return {
                background: 'rgb(145 254 159 / 47%)',
                color: 'green',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600"
            }
        }
        else if (row.researchStatusName === "Đã giao") {
            return {
                background: '#0fa4c6',
                color: 'white',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600"
            }
        }
        else if (row.researchStatusName === "Đang duyệt") {
            return {
                background: '#ff7b39',
                color: 'white',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600"
            }
        }
        else {
            return {
                background: '#8fc60f',
                color: 'white',
                fontSize: "16px",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "600"
            }
        }
    }
    const value = {
        listSchoolYear,
        setListSchoolYear,
        listPosition,
        setListPosition,
        subjects,
        setSubjects,
        lectures,
        setLectures,
        classes,
        setClasses,
        students,
        setStudents,
        account,
        setAccount,
        listNameFile,
        setListNameFile,
        showLoading,
        setShowLoading,
        schoolYearMax,
        setSchoolYearMax,
        styleStatus,
    }
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export { Context, ContextProvider };