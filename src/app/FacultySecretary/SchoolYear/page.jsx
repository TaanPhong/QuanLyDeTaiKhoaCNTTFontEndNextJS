'use client'
import { SidebarData } from '@/data/DataSideBar';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap';
import { ImCogs } from 'react-icons/im';
import styles from '@/style/schoolYear.module.css'
import Link from 'next/link';
import TableSchoolYear from '@/components/table/TableSchooleYear';
import ModalsAddSchoolYear from '@/components/Modals/ModalsAddSchoolYear';
import { UilPlusCircle } from '@iconscout/react-unicons'
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { Context } from '@/context/Context';
import Loading from '@/components/Loading/Loading';

export default function page() {
    const [active, setActive] = useState(2);
    const [show, setShow] = useState(false);
    const [schoolYear, setSchoolYear] = useState(null);
    const [update, setUpdate] = useState(false);
    const [search, setSearch] = useState("");
    const context = useContext(Context)
    const refSearch = useRef();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [change, setChange] = useState(true);

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
                        <h4 style={{ marginBottom: "20px" }}>Quản lý niên khóa</h4>
                        <div className={styles.search} style={{ marginLeft: "0px" }}>
                            <input type="text" placeholder='Nhập tên niên khóa' ref={refSearch} onChange={() => setSearch(refSearch.current.value)} className={styles.inputSearch} />
                            <SearchIcon className={styles.iconSearch} />
                        </div>
                    </div>
                    <button className={styles.button} onClick={() => {
                        setShow(true)
                    }}>
                        <UilPlusCircle />
                        Thêm niên khóa
                    </button>
                </div>
                <div className={styles.table}>
                    <TableSchoolYear
                        setShow={setShow}
                        setSchoolYear={setSchoolYear}
                        setUpdate={setUpdate}
                        search={search}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        setChange={setChange}
                        change={change}
                    />
                </div>
            </div>
            <ModalsAddSchoolYear
                setShow={setShow}
                show={show}
                schoolYear={schoolYear}
                setSchoolYear={setSchoolYear}
                update={update}
                setUpdate={setUpdate}
                setChange={setChange}
                change={change}
            />
            <Loading />
        </Container>
    )
}
