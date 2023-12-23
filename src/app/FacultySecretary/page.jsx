"use client"
import styles from "@/style/faculty.module.css"
import { ImCogs } from "react-icons/im";
import { SidebarData } from "@/data/DataSideBar"
import TableFacultyResearch from '@/components/table/TableFacultyResearch';
import { LiaListAltSolid, LiaFileAltSolid, LiaTimesSolid } from "react-icons/lia";
import axios from 'axios';
import { toast } from 'react-toastify';
import ModalsResearchDetail from '@/components/Modals/ModalsResearchDetail';
import { use, useContext, useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Link from "next/link";
import { Context } from "@/context/Context";
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import Dropdown from 'react-bootstrap/Dropdown';

export default function page() {
    const [selected, setSelected] = useState([]);
    const [change, setChange] = useState(false);
    const [showModalsDetail, setShowModalsDetail] = useState(false);
    const [research, setResearch] = useState(null);
    const [active, setActive] = useState(0);
    const context = useContext(Context);
    const [search, setSearch] = useState("");
    const refSearch = useRef();
    const [schoolYearId, setSchoolYearId] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [status, setStatus] = useState("");
    const [listStatus, setListStatus] = useState([])
    let dateStart = new Date(context.schoolYearMax.dateStart)
    let dateEnd = new Date(context.schoolYearMax.dateEnd);
    let dateNow = new Date();
    let checkDate = dateStart.getTime() <= dateNow.getTime() && dateNow.getTime() <= dateEnd.getTime();

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
        axios.get("http://localhost:8081/schoolYear/max")
            .then(res => {
                context.setSchoolYearMax(res.data)
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi")
                console.log("Lỗi lấy niên khóa max", err)
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
        axios.get('http://localhost:8081/researchStatus')
            .then(res => {
                setListStatus(res.data.filter(item => item.statusName !== "Khởi tạo"))
            })
            .catch(err => {
                toast.error('Hệ thống xảy ra lỗi')
                console.log("Lỗi lấy trạng thái", err)
            })
    }, [])

    useEffect(() => {
        if (context.showLoading) {
            context.setShowLoading(false)
        }
    }, [])

    const handleOnClickRevise = () => {
        if (selected.length === 0) {
            toast.warning("Vui lòng chọn các đề tài để thực hiện thao tác!")
        }
        else {
            axios.post("http://localhost:8081/research/update/revise/" + 7 + "/" + context.account?.username, selected)
                .then((res) => {
                    toast.success("Chuyển tiếp thành công.")
                    setSelected([])
                    setChange(!change)
                })
                .catch((err) => {
                    toast.warning("Xảy ra lỗi!")
                    console.log("Lỗi update danh sách đề tài: ", err)
                })
        }
    }

    const handleExportFilePDF = () => {
        let id = context.schoolYearMax.id;
        if (schoolYearId) {
            id = schoolYearId;
        }
        console.log("id school year", id)
        axios.get("http://localhost:8081/statistical/student/pdf/" + id, {
            responseType: 'blob', // Để xác định dữ liệu trả về là file
        })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "statisticalStudent.pdf");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi")
                console.log("Lỗi xuất file", err)
            })
    }

    const handleExportFileExcel = () => {
        let id = context.schoolYearMax.id;
        if (schoolYearId) {
            id = schoolYearId;
        }
        console.log("id school year excel", id)
        axios.get("http://localhost:8081/statistical/student/excel/" + id, {
            responseType: 'blob', // Để xác định dữ liệu trả về là file
        })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "statisticalStudent.xlsx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi")
                console.log("Lỗi xuất file", err)
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
                <div className={styles.top}>
                    <div>
                        <h4 style={{ marginBottom: "25px" }}>Quản lý đề tài</h4>
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
                            }
                            } className={styles.comboBox}>
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
                                            return <option value={item.id}>{item.statusName}</option>
                                        })
                                    }

                                </select>
                            </div>
                        </div>

                    </div>
                    <div className={styles.topRight}>
                        <button className={styles.button} onClick={() => handleOnClickRevise()}>
                            <LiaListAltSolid className={styles.iconBtn} />
                            Chuyển tiếp
                        </button>
                    </div>
                </div>
                <div style={{
                    marginBottom: "30px",
                    display: "flex",
                    justifyContent: "end"
                }}>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Xuất file
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleExportFileExcel}>Xuất file excel</Dropdown.Item>
                            <Dropdown.Item onClick={handleExportFilePDF}>Xuất file pdf</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className={styles.table}>
                    <TableFacultyResearch
                        setSelected={setSelected}
                        selected={selected}
                        setChange={setChange}
                        change={change}
                        setShowModalsDetail={setShowModalsDetail}
                        showModalsDetail={showModalsDetail}
                        setResearch={setResearch}
                        search={search}
                        schoolYearId={schoolYearId}
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
                setResearch={setResearch}
            />
            <Loading />
        </Container>
    )
}
