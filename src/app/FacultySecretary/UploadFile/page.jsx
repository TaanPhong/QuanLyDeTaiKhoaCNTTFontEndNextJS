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
import TableUploadFile from '@/components/table/TableUploadFile';
import ModalsUpFileReport from '@/components/Modals/ModalsUpFileReport';
import ModalsAddFileReport from '@/components/Modals/ModalsAddFileReport';
import Loading from '@/components/Loading/Loading';
import { useRouter } from 'next/navigation';

export default function page() {
    const [active, setActive] = useState(6);
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
                setClassCode(res.data[0]?.classCode)
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
    }, [])

    useEffect(() => {
        axios.get("http://localhost:8081/uploadFile/names")
            .then(res => {
                context.setListNameFile(res.data)
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi.")
                console.log("Lỗi lấy danh sách tên file báo cáo", err)
            })
    }, [change])

    useEffect(() => {
        if (context.showLoading) {
            context.setShowLoading(false)
        }
    }, [])

    const handleOnclickAuto = () => {
        //toast.info("Hệ thống kiểm tra dữ liệu.")
        axios.get("http://localhost:8081/check/uploadFileAuto")
            .then(res => {
                if (res.data) {
                    setShowModals(true)
                }
                else {
                    toast.info("Không có đề tài nào cần nộp báo cáo")
                }
            })
            .catch(err => {
                toast.error("Hệ thống gặp sự cố trong quá trình kiểm tra dữ liệu")
                console.log("Lỗi kiểm tra thêm file", err)
            })
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
                        <h4 style={{ marginBottom: "20px" }}>Quản lý thông tin tập tin báo cáo</h4>
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
                            handleOnclickAuto();
                        }}>
                            <UilPlusCircle />
                            Thêm tập tin
                        </button>
                    </div>
                </div>
                <div className={styles.table}>
                    <TableUploadFile
                        setUpdate={setUpdate}
                        setChange={setChange}
                        change={change}
                        classCode={classCode}
                        setStudent={setStudent}
                        search={search}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        setShow={setShow}
                    />
                </div>
            </div>
            <ModalsUpFileReport
                setShow={setShowModals}
                show={showModals}
                setChange={setChange}
                change={change}
            />
            <ModalsAddFileReport
                setShow={setShow}
                show={show}
                student={student}
                setChange={setChange}
                change={change}
            />
            <Loading />
        </Container>
    )
}
