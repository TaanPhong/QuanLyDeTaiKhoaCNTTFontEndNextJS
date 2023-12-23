'use client'
import { Context } from '@/context/Context';
import { SidebarData } from '@/data/DataSideBar';
import { useContext, useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap';
import { ImCogs } from 'react-icons/im';
import styles from '@/style/student.module.css'
import Link from 'next/link';
import { UilPlusCircle, UilFileImport } from '@iconscout/react-unicons'
import axios from 'axios';
import { toast } from 'react-toastify';
import ModalsUpFileStudent from '@/components/Modals/ModalsUpfileStudent';
import TableAssignment from '@/components/table/TableAssignment';
import ModalsUpdateResearch from '@/components/Modals/ModalsUpdateResearch';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading/Loading';
import Dropdown from 'react-bootstrap/Dropdown';

export default function page() {
    const [active, setActive] = useState(5);
    const [change, setChange] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [showModals, setShowModals] = useState(false);
    const [student, setStudent] = useState(null);
    const context = useContext(Context);
    const [search, setSearch] = useState("")
    const refSearch = useRef()
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [sumStudentNotResearch, setSumStudentNotResearch] = useState(0);
    const [studentNotResearches, setStudentNotResearches] = useState([]);
    const colors = ["#59bfff", "#c828288f", '#bcbf1b8f', '#fb0303', 'green', '#0fa4c6']

    if (!context.account) {
        router.push("/")
    }
    else {
        if (context.account.positionName !== "Thư ký khoa") {
            context.setAccount(null)
            router.push("/")
        }
    }

    useEffect(() => {
        axios.get("http://localhost:8081/classes")
            .then(res => {
                context.setClasses(res.data);
            })
            .catch(err => {
                toast.error("Quá trình lấy danh sách lớp xảy ra lỗi!")
                console.log("Lỗi láy danh sách lớp", err)
            })
        axios.get("http://localhost:8081/student")
            .then(res => {
                context.setStudents(res.data);
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi!")
                console.log("Lỗi lấy tất cả sinh viên", err);
            })
        axios.get("http://localhost:8081/subjects")
            .then(res => {
                context.setSubjects(res.data);
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi!")
                console.log("Lỗi lấy danh môn học", err)
            })
    }, [])

    useEffect(() => {
        if (context.showLoading) {
            context.setShowLoading(false)
        }
    }, [])


    useEffect(() => {
        axios.get("http://localhost:8081/infor/student/research/all")
            .then(res => {
                if (res.data) {
                    setSumStudentNotResearch(res.data);
                }
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi")
                console.log("Quá trình kiểm tra sinh vien không có đề tài xảy ra lỗi", err)
            })
    }, [change])

    useEffect(() => {
        axios.get("http://localhost:8081/infor/sutdent/research")
            .then(res => {
                setStudentNotResearches(res.data)
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi!")
                console.log("Lỗi lấy danh sách sinh viên chưa có đề tài", err)
            })
    }, [change])

    const handleAssignAuto = () => {
        axios.get("http://localhost:8081/assginment/" + context.account?.username)
            .then(res => {
                toast.success("Giao đề tài tự động thành công")
                setChange(!change)
            })
            .catch(err => {
                console.log("Lỗi giao đề tài tự động", err)
                toast.error("Quá trình giao đề tài tự động xảy ra lỗi!")
            })
    }

    const handleCheckAssignmentAuto = () => {
        let dateNow = new Date();
        let dateEnd = new Date(context.schoolYearMax.dateEnd);
        let dateStart = new Date(context.schoolYearMax.dateStart);
        if (dateEnd.getTime() < dateNow.getTime() || dateStart.getTime() > dateNow.getTime()) {
            toast.info("Hiện tại không phải là thời gian thực hiện đề tài.")
        }
        else {
            toast.info("Hệ thống đang kiểm tra dữ liệu")
            axios.get("http://localhost:8081/check/assginment")
                .then(res => {
                    if (res.data) {
                        handleAssignAuto();
                    }
                    else {
                        toast.info("Tất cả đề tài đủ điều kiện đã được giao cho sinh viên.")
                    }
                })
                .catch(err => {
                    toast.error("Quá trình kiểm tra xảy ra lỗi!")
                    console.log("Lỗi kiểm tra giao tự động", err)
                })
        }
    }

    return (
        <Container className={styles.container}>
            <div className={styles.left}>
                <div className={styles.topSidebar}>
                    <ImCogs className={styles.icons} />
                    <span>Tính năng</span>
                </div>
                <div className={styles.sidebar}>
                    {
                        SidebarData.map((item, index) => {
                            return (
                                <Link href={item.link} className={styles.menuItem} onClick={() => {
                                    setActive(index);
                                    context.setShowLoading(true);
                                }}>
                                    <item.icon className={index === active ? styles.active : ""} />
                                    <span className={index === active ? styles.active : ""}>{item.heading}</span>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.topRight}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start"
                    }}>
                        <h4 style={{ marginBottom: "20px" }}>Quản lý giao đề tài cho sinh viên</h4>
                        <div style={{ display: "flex" }}>
                            <span style={{
                                marginRight: "10px",
                                fontWeight: "600",
                                fontSize: "18px",
                                textAlign: "center",
                                marginTop: "10px"
                            }}>Lớp: </span>
                            <select onChange={(e) => {
                                setClassCode(e.target.value)
                                setIsLoading(true)
                            }} className={styles.comboBox}>
                                <option value="">Tất cả</option>
                                {
                                    context.classes?.map(item => {
                                        return (
                                            <option value={item.classCode}>{item.className}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className={styles.search}>
                                <input type="text" placeholder='Nhập tên sinh viên' ref={refSearch} onChange={() => setSearch(refSearch.current.value)} className={styles.inputSearch} />
                                <SearchIcon className={styles.iconSearch} />
                            </div>
                        </div>
                    </div>
                    <div style={
                        {
                            display: "flex",
                            gap: "10px"
                        }
                    }>
                        <button className={styles.button} onClick={() => {
                            handleCheckAssignmentAuto()
                        }}>
                            <UilPlusCircle />
                            Giao tự dộng
                        </button>
                    </div>
                </div>
                {
                    sumStudentNotResearch ? <div style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        fontSize: "20px",
                        fontWeight: "500",
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <div>
                            <span>Số lượng sinh viên chưa được giao đề tài: {sumStudentNotResearch}</span>
                            <div style={{
                                marginTop: "10px"
                            }}>
                                {
                                    studentNotResearches.map((item, index) => {
                                        return <span style={{ marginRight: "20px", color: colors[index] }}>{context.subjects[index]?.subjectCode + ": " + item}</span>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                        : null
                }
                <div className={styles.table}>
                    <TableAssignment
                        setShow={setShowModals}
                        setChange={setChange}
                        change={change}
                        classCode={classCode}
                        setStudent={setStudent}
                        search={search}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                </div>
            </div>
            <ModalsUpdateResearch
                setShow={setShowModals}
                show={showModals}
                student={student}
                setChange={setChange}
                change={change}
                setStudent={setStudent}
            />
            <Loading />
        </Container>
    )
}
