'use client'
import { Context } from "@/context/Context";
import style from "@/style/header.module.css"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { useContext, useState } from "react";
import { Container } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import { FaUserCircle } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import ModalsChangePassword from "../Modals/ModalsChangePassword";

export const AppHeader = () => {
    const context = useContext(Context)
    const router = useRouter();
    const [show, setShow] = useState<boolean>(false);
    const handleOnClick = () => {
        context.setAccount(null);
        context.setShowLoading(false);
        router.push("/")
    }
    const handleChangePassword = () => {
        context.setShowLoading(true);
        router.push("/User")
    }
    return (
        <div className={style.appHeader}>
            <div className={style.leftHeader}   >
                <Image src="/PTITLOGO.png" width={100} height={100} alt="Logo" />
            </div>
            {
                context.account ? <div className={style.rightHeader}>
                    <Dropdown>
                        <Dropdown.Toggle variant="none" id="dropdown-basic">
                            <FaUserCircle className={style.icons} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleChangePassword}>Đổi mật khẩu</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <button className={style.btnLogin} onClick={handleOnClick}>Đăng xuất</button>
                </div>
                    : <></>
            }
        </div>
    )
}
