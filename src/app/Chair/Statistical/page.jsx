'use client'
import { Context } from '@/context/Context';
import { SidebarData, SidebarDataChair } from '@/data/DataSideBar';
import { useContext, useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap';
import { ImCogs } from 'react-icons/im';
import styles from '@/style/student.module.css'
import Link from 'next/link';
import { UilPlusCircle, UilFileImport } from '@iconscout/react-unicons'
import axios from 'axios';
import { toast } from 'react-toastify';
import StatisticalResearchSchoolYear from '@/components/statistical/StatisticalResearchSchoolyear';
import StatisticalResearchSubject from '@/components/statistical/StatisticalResearchSubject';
import ExportFile from '@/components/statistical/ExportFile';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading/Loading';

export default function page() {
    const [active, setActive] = useState(2);
    const [statisticalType, setStatisticalType] = useState("Đề tài - năm");
    const [schoolYearId, setSchoolYearId] = useState(1);
    const [academicYear, setAcademicYear] = useState(2019);
    const [schoolYear, setSchoolYear] = useState([]);
    const context = useContext(Context);
    const refSearch = useRef();
    const router = useRouter();

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
        if (context.listSchoolYear.length !== 0) {
            const nameYear = context.listSchoolYear?.find(item => item.id == schoolYearId)
            if (nameYear) {
                setAcademicYear(nameYear.academicYear)
            }
        }
    }, [schoolYearId])

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

    const displayComboboxSchoolYear = () => {
        return <select onChange={e => setSchoolYearId(e.target.value)} className={styles.comboBox} style={{ marginLeft: "20px" }}>
            {
                context.listSchoolYear?.map(item => {
                    return <option value={item.id}>{item.schoolYearName}</option>
                })
            }
        </select>
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
                <div className={styles.topRight}>
                    <div style={
                        {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start"
                        }
                    }>
                        <h4>Thống kê</h4>
                    </div>
                    <div style={
                        {
                            display: "flex",
                            gap: "10px",
                            marginTop: "35px"
                        }
                    }>
                        <ExportFile />
                    </div>
                </div>
                <div className={styles.table}>
                    <StatisticalResearchSchoolYear />
                    <span style={
                        {
                            fontSize: "20px",
                            marginRight: "5px",
                            marginTop: "3px",
                            fontWeight: "600"
                        }
                    }>Lọc theo niên khóa: </span>
                    {displayComboboxSchoolYear()}
                    <StatisticalResearchSubject schoolYearId={schoolYearId} academicYear={academicYear} />
                </div>
            </div>
            <Loading />
        </Container>
    )
}
