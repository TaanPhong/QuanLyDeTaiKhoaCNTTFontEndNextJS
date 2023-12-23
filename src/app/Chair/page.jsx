"use client"
import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import styles from '@/style/home.module.css'
import TableHome from '@/components/table/TableHome'
import { FaTasks, FaFolderPlus } from "react-icons/fa";
import CreateResearch from '@/components/Modals/ModalsAddResearch'
import { use, useContext, useEffect, useRef, useState } from 'react'
import axios from "axios"
import { ImCogs } from "react-icons/im";
import { SidebarDataChair, SidebarDataLecture } from "@/data/DataSideBar"
import ModalsAddResearchDetail from '@/components/Modals/ModalsResearchDetail'
import { toast } from 'react-toastify'
import ModalsResearchDetail from '@/components/Modals/ModalsResearchDetail'
import { Context } from '@/context/Context'
import Link from "next/link";
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading/Loading'
export default function Home() {

    const [showModals, setShowModals] = useState(false);
    const [update, setUpdate] = useState(false);
    const [research, setResearch] = useState(null);
    const [change, setChange] = useState(false);
    const [showModalsDetail, setShowModalsDetail] = useState(false);
    const [selected, setSelected] = useState([]);
    const context = useContext(Context);
    const [schoolYearId, setSchoolYearId] = useState(0);
    const [active, setActive] = useState(0);
    const [search, setSearch] = useState("");
    const refSearch = useRef()
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true)
    const [listStatus, setListStatus] = useState([]);
    const [status, setStatus] = useState("");

    if (!context.account) {
        router.push("/")
    }
    else {
        if (context.account.positionName !== "Trưởng khoa") {
            context.setAccount(null)
            router.push("/")
        }
    }

    useEffect(() => {
        axios.get("http://localhost:8081/SchoolYears")
            .then(res => {
                context.setListSchoolYear(res.data)
            })
            .catch(err => {
                toast.error("Hệ thống đang xảy ra lỗi!")
                console.log("Lỗi lấy danh sách niên khóa", err)
            })
    }, [])

    useEffect(() => {
        if (context.showLoading) {
            context.setShowLoading(false)
        }
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8081/researchStatus')
            .then(res => {
                setListStatus(res.data)
            })
            .catch(err => {
                toast.error('Hệ thống xảy ra lỗi')
                console.log("Lỗi lấy trạng thái", err)
            })
    }, [])


    const handleOnClickRevise = () => {
        if (selected.length > 0) {
            console.log("select", selected)
            axios.post("http://localhost:8081/research/update/revise/" + 1 + '/' + context.account?.username, selected)
                .then(res => {
                    toast.success("Yêu cầu đã được gửi.")
                    setChange(!change)
                    setSelected([])
                })
                .catch(err => {
                    console.log(err)
                    toast.warning("Hệ thống sảy ra lỗi.")
                })
        }
        else {
            toast.info("Vui lòng chọn đề tài muốn được duyệt!")
        }
    }

    const handleAddResearch = () => {
        let dateNow = new Date();
        let dateEnd = new Date(context.schoolYearMax.dateEnd);
        let dateStart = new Date(context.schoolYearMax.dateStart);
        if (dateEnd.getTime() < dateNow.getTime() || dateStart.getTime() > dateNow.getTime()) {
            toast.info("Hiện tại không phải là thời gian đăng ký đề tài.")
        }
        else {
            setShowModals(true)
        }
    }

    useEffect(() => {
        axios.get("http://localhost:8081/schoolYear/max")
            .then(res => {
                context.setSchoolYearMax(res.data)
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi")
                console.log("Lỗi lấy niên khóa max", err)
            })
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
                        SidebarDataChair.map((item, index) => {
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

                <div className={styles.top}>
                    <div>
                        <h4 style={{ marginBottom: "20px" }}>{"Giảng viên: " + context.account?.fullName}</h4>
                        <div style={{
                            display: 'flex'
                        }}>
                            <span style={{
                                marginRight: "10px",
                                fontWeight: "600",
                                fontSize: "18px",
                                textAlign: "center",
                                marginTop: "10px"
                            }}>Niên khóa:</span>
                            <select onChange={e => {
                                setSchoolYearId(e.target.value)
                                setIsLoading(true)
                            }} className={styles.comboBox}>
                                <option value={0}>Tất cả</option>
                                {
                                    context.listSchoolYear?.map(item => {
                                        return <option value={item.id}>{item.schoolYearName}</option>
                                    })
                                }
                            </select>
                            <div className={styles.search}>
                                <input type="text" placeholder='Nhập tên đề tài' ref={refSearch} onChange={() => setSearch(refSearch.current.value)} className={styles.inputSearch} />
                                <SearchIcon className={styles.iconSearch} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.groupBtn}>
                        <button className={styles.btnAdd}
                            style={{
                                background: '#35a6e8',
                            }}
                            onClick={() => handleOnClickRevise()}
                        >
                            <FaTasks className={styles.icons} />
                            <span style={{ marginTop: "3px" }}>Yêu cầu duyệt</span>
                        </button>
                        <button className={styles.btnAdd} onClick={() => handleAddResearch()}>
                            <FaFolderPlus className={styles.icons} />
                            <span style={{ marginTop: "3px" }}>Thêm đề tài</span>
                        </button>
                    </div>
                </div>
                <div style={{ marginBottom: "30px" }}>
                    <span style={{
                        //marginLeft: "30px",
                        marginRight: "10px",
                        fontWeight: "600",
                        fontSize: "18px",
                        textAlign: "center",
                        marginTop: "10px"
                    }}>Trạng thái:</span>
                    <select onChange={e => {
                        setStatus(e.target.value)
                        //setIsLoading(true)
                    }
                    } className={styles.comboBox}>
                        <option value={""}>Tất cả</option>
                        {
                            listStatus.map(item => {
                                return <option value={item.statusName}>{item.statusName}</option>
                            })
                        }

                    </select>
                </div>
                <div className={styles.table}>
                    <TableHome setShowModals={setShowModals}
                        setUpdate={setUpdate}
                        setResearch={setResearch}
                        setChange={setChange} change={change}
                        setShowModalsDetail={setShowModalsDetail}
                        setSelected={setSelected}
                        selected={selected}
                        schoolYearId={schoolYearId}
                        search={search}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        status={status}
                    />
                </div>
                <CreateResearch
                    showModals={showModals}
                    setShowModals={setShowModals}
                    update={update}
                    setUpdate={setUpdate}
                    setResearch={setResearch}
                    research={research}
                    setChange={setChange}
                    change={change}
                />
                <ModalsResearchDetail
                    setShow={setShowModalsDetail}
                    show={showModalsDetail}
                    research={research}
                    setResearch={setResearch}
                />
                <Loading />
            </div>
        </Container>
    )
}
