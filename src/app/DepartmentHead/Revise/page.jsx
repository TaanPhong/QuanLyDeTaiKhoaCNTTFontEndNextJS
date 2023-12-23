"use client"
import styles from "@/style/faculty.module.css"
import { ImCogs } from "react-icons/im";
import { SidebarDataDepartment } from "@/data/DataSideBar"
import TableDepartment from '@/components/table/TableDepartmentResearch';
import { LiaListAltSolid, LiaFileAltSolid, LiaTimesSolid } from "react-icons/lia";
import axios from 'axios';
import { toast } from 'react-toastify';
import ModalsResearchDetail from '@/components/Modals/ModalsResearchDetail';
import { useContext, useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Link from "next/link";
import { Context } from "@/context/Context";
import SearchIcon from '@mui/icons-material/Search';
import ModalsAddNoteResearch from "@/components/Modals/ModalsAddNoteResearch";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";

export default function page() {
    const [selected, setSelected] = useState([]);
    const [change, setChange] = useState(false);
    const [showModalsDetail, setShowModalsDetail] = useState(false);
    const [research, setResearch] = useState(null);
    const [active, setActive] = useState(1);
    const context = useContext(Context)
    const [schoolYearId, setSchoolYearId] = useState(0);
    const [search, setSearch] = useState("");
    const [showNote, setShowNote] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const deleted = false;
    const refSearch = useRef()
    const router = useRouter();
    const [status, setStatus] = useState("");
    const [listStatus, setListStatus] = useState([])

    if (!context.account) {
        router.push("/")
    }
    else {
        if (context.account.positionName !== "Trưởng bộ môn") {
            context.setAccount(null)
            router.push("/")
        }
    }

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

    const handleOnClickRevise = (status) => {
        if (selected.length === 0) {
            toast.warning("Vui lòng chọn các đề tài để thực hiện thao tác!")
        }
        else {
            axios.post("http://localhost:8081/research/update/revise/" + status + "/" + context.account?.username, selected)
                .then((res) => {
                    if (status == 2) {
                        toast.success("Duyệt thành công.")
                    }
                    else if (status == 3) {
                        toast.success("Đề tài đã được yêu cầu chỉnh sửa thành công.")
                    }
                    else {
                        toast.success("Đề tài đã bị từ chối.")
                    }
                    setChange(!change)
                    setSelected([])
                })
                .catch((err) => {
                    toast.warning("Xảy ra lỗi!")
                    console.log("Lỗi cập nhật trạng thái của đề tài", err)
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
                        SidebarDataDepartment.map((item, index) => {
                            return (
                                <Link href={item.link} className={styles.menuItem} onClick={() => context.setShowLoading(true)}>
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
                        <h4 style={{ marginBottom: "20px" }}>Quản lý duyệt đề tài</h4>
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
                            <div>
                                <span style={{
                                    marginLeft: "30px",
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
                        </div>
                    </div>
                    <div className={styles.topRight}>
                        <div>
                            <button className={styles.button} onClick={() => handleOnClickRevise(2)}>
                                <LiaListAltSolid className={styles.iconBtn} />
                                Chuyển tiếp
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.table}>
                    <TableDepartment
                        setSelected={setSelected}
                        selected={selected}
                        setChange={setChange}
                        change={change}
                        setShowModalsDetail={setShowModalsDetail}
                        showModalsDetail={showModalsDetail}
                        setResearch={setResearch}
                        search={search}
                        schoolYearId={schoolYearId}
                        setShowNote={setShowNote}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        status={status}
                    />
                </div>
            </div>
            <ModalsResearchDetail
                setShow={setShowModalsDetail}
                show={showModalsDetail}
                research={research}
            />
            <ModalsAddNoteResearch
                setShowModals={setShowNote}
                showModals={showNote}
                research={research}
                change={change}
                setChange={setChange}
                deleted={deleted}
                setSelected={setSelected}
            />
            <Loading />
        </Container>
    )
}
