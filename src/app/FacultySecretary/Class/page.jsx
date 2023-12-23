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
import TableStudent from '@/components/table/TableStudent';
import ModalsUpFileClass from '@/components/Modals/ModalsUpFileClass';
import ModalsAddClass from '@/components/Modals/ModalsAddClass';
import TableClass from '@/components/table/TableClass';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading/Loading';

export default function page() {
    const [active, setActive] = useState(3);
    const [show, setShow] = useState(false);
    const [update, setUpdate] = useState(false);
    const [change, setChange] = useState(false);
    const [showModals, setShowModals] = useState(false);
    const [classes, setClasses] = useState(null);
    const context = useContext(Context);
    const [search, setSearch] = useState("");
    const [subjectCode, setSubjectCode] = useState(0);
    const refSearch = useRef();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true)

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
        axios.get("http://localhost:8081/subjects")
            .then(res => {
                context.setSubjects(res.data);
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi!")
                console.log("Lỗi lấy tất cả môn học", err);
            })
    }, [])

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
                        <h4 style={{ marginBottom: "20px" }}>Quản lý lớp</h4>
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
                            }}>Bô môn:</span>
                            <select onChange={(e) => {
                                setSubjectCode(e.target.value)
                                setIsLoading(true);
                            }} className={styles.comboBox}>
                                <option value="0">Tất cả</option>
                                {
                                    context.subjects?.map(item => {
                                        return (
                                            <option value={item.subjectCode}>{item.subjectName}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className={styles.search}>
                                <input type="text" placeholder='Nhập tên lớp' ref={refSearch} onChange={() => setSearch(refSearch.current.value)} className={styles.inputSearch} />
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
                            setShowModals(true)
                        }}>
                            <UilPlusCircle />
                            Thêm lớp
                        </button>
                        <button className={styles.button} onClick={() => {
                            setShow(true)
                        }}>
                            <UilFileImport />
                            Thêm danh sách lớp
                        </button>
                    </div>
                </div>
                <div className={styles.table}>
                    <TableClass
                        setShow={setShowModals}
                        setUpdate={setUpdate}
                        setChange={setChange}
                        change={change}
                        setClasses={setClasses}
                        subjectCode={subjectCode}
                        search={search}
                        setIsLoading={setIsLoading}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <ModalsUpFileClass
                setShow={setShow}
                show={show}
                setChange={setChange}
                change={change}
            />
            <ModalsAddClass
                setShow={setShowModals}
                show={showModals}
                classes={classes}
                setChange={setChange}
                change={change}
                setUpdate={setUpdate}
                update={update}
                setClasses={setClasses}
            />
            <Loading />
        </Container>
    )
}
