'use client'
import { SidebarData } from '@/data/DataSideBar';
import React, { use, useContext, useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap';
import { ImCogs } from 'react-icons/im';
import styles from '@/style/schoolYear.module.css'
import Link from 'next/link';
import { UilPlusCircle } from '@iconscout/react-unicons'
import TableLecture from '@/components/table/TableLecture';
import ModalsAddLecture from '@/components/Modals/ModalsAddLecture';
import { Context } from '@/context/Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading/Loading';

export default function page() {
    const [active, setActive] = useState(1);
    const [show, setShow] = useState(false);
    const [lecture, setLecture] = useState(null);
    const [update, setUpdate] = useState(false);
    const [change, setChange] = useState(false);
    const context = useContext(Context);
    const [search, setSearch] = useState("");
    const refSearch = useRef();
    const [subjectCode, setSubjectCode] = useState(0)
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
        axios.get("http://localhost:8081/subjects")
            .then(res => {
                context.setSubjects(res.data);
            })
            .catch(err => {
                console.log("Lỗi lấy bộ môn", err);
                toast.error("Hệ thống đang sảy ra lỗi.")
            })
        axios.get("http://localhost:8081/postions")
            .then(res => {
                context.setListPosition(res.data)
            })
            .catch(err => {
                console.log("Lỗi lấy chức vụ", err);
                toast.error("Hệ thống đang sảy ra lỗi.")
            })

    }, [])

    useEffect(() => {
        axios.get('http://localhost:8081/lectures')
            .then(res => {
                let getRow = res.data.map((item, index) => {
                    return {
                        stt: index + 1,
                        ...item,
                    }
                })
                context.setLectures(getRow);
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi")
                console.log("Lỗi lấy data giảng viên")
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
                        <h4 style={{ marginBottom: "20px" }}>Quản lý giảng viên</h4>
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
                                setIsLoading(true)
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
                    <button className={styles.button} onClick={() => {
                        setShow(true)
                    }}>
                        <UilPlusCircle />
                        Thêm giảng viên
                    </button>
                </div>
                <div className={styles.table}>
                    <TableLecture
                        setShow={setShow}
                        setLecture={setLecture}
                        setUpdate={setUpdate}
                        setChange={setChange}
                        change={change}
                        subjectCode={subjectCode}
                        search={search}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                </div>
            </div>
            <ModalsAddLecture
                setShow={setShow}
                show={show}
                lecture={lecture}
                setLecture={setLecture}
                update={update}
                setUpdate={setUpdate}
                setChange={setChange}
                change={change}
            />
            <Loading />
        </Container>
    )
}
