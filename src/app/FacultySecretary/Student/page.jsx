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
import ModalsAddStudent from '@/components/Modals/ModalsAddStudent';
import TableStudent from '@/components/table/TableStudent';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading/Loading';

export default function page() {
    const [active, setActive] = useState(4);
    const [show, setShow] = useState(false);
    const [update, setUpdate] = useState(false);
    const [change, setChange] = useState(false);
    const [classCode, setClassCode] = useState(null);
    const [showModals, setShowModals] = useState(false);
    const [student, setStudent] = useState(null);
    const context = useContext(Context);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const refSearch = useRef();
    const router = useRouter();

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
                if (!classCode) {
                    setClassCode(res.data[0]?.classCode)
                }
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
    }, [change])

    useEffect(() => {
        if (context.showLoading) {
            context.setShowLoading(false)
        }
    }, [])

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
                        <h4 style={{ marginBottom: "20px" }}>Quản lý sinh viên</h4>
                        <div style={
                            {
                                display: 'flex'
                            }
                        }>
                            <span style={{
                                marginRight: "10px",
                                fontWeight: "600",
                                fontSize: "18px",
                                textAlign: "center",
                                marginTop: "10px"
                            }}>Lớp:  </span>
                            <select onChange={(e) => {
                                setClassCode(e.target.value)
                                setIsLoading(true)
                            }} className={styles.comboBox}>
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
                            gap: "10px",
                        }
                    }>
                        <button className={styles.button} onClick={() => {
                            setShowModals(true)
                        }}
                            style={{ fontSize: "14px" }}
                        >
                            <UilPlusCircle />
                            Thêm sinh viên
                        </button>
                        <button className={styles.button} onClick={() => {
                            setShow(true)
                        }}
                            style={{ fontSize: "14px" }}
                        >
                            <UilFileImport />
                            Thêm danh sách sinh viên
                        </button>
                    </div>
                </div>
                <div className={styles.table}>
                    <TableStudent
                        setShow={setShowModals}
                        setUpdate={setUpdate}
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
            <ModalsUpFileStudent
                setShow={setShow}
                show={show}
                change={change}
                setChange={setChange}
            />
            <ModalsAddStudent
                setShow={setShowModals}
                show={showModals}
                student={student}
                setChange={setChange}
                change={change}
                setUpdate={setUpdate}
                update={update}
                setStudent={setStudent}
                classesCode={classCode}
            />
            <Loading />
        </Container>
    )
}
