"use client"
import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import styles from '@/style/changePassword.module.css'
import { use, useContext, useEffect, useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { Context } from '@/context/Context'
import { useRouter } from 'next/navigation'
export default function Home() {
    const [errPasswordOld, setErrPasswordOld] = useState("");
    const [errPasswordNew, setErrPasswordNew] = useState("");
    const [errPasswordConfirm, setErrPasswordConfirm] = useState("");
    const router = useRouter();
    const context = useContext(Context);

    useEffect(() => {
        if (context.showLoading) {
            context.setShowLoading(false)
        }
    }, [])

    if (!context.account) {
        router.push("/")
    }

    const handleClose = () => {
        setShow(false);
        setErrPasswordOld("")
        setErrPasswordConfirm("")
        setErrPasswordNew("")
        formik.values.passwordOld = ""
        formik.values.passwordNew = ''
        formik.values.passwordConfirm = ""
    }

    const formik = useFormik({
        initialValues: {
            passwordOld: "",
            passwordNew: "",
            passwordConfirm: "",
        },
        onSubmit: values => {
            let submit = true;
            if (context.account) {
                if (!values.passwordOld) {
                    setErrPasswordOld("Mật khẩu cũ không được bỏ trống!")
                    submit = false;
                }
                else if (values.passwordOld != context.account?.password) {
                    setErrPasswordOld("Mật khẩu cũ không chính xác.")
                    submit = false;
                }
            }
            if (!values.passwordNew) {
                setErrPasswordNew("Mật khẩu mới không được để trống.")
                submit = false
            }
            else if (values.passwordNew.length < 6) {
                setErrPasswordNew("Mật khẩu cần tối thiểu 6 ký tự.")
                submit = false
            }
            else if (values.passwordNew && values.passwordOld && values.passwordNew === values.passwordOld) {
                setErrPasswordNew("Vui lòng không nhập lại mật khẩu cũ")
                submit = false
            }
            if (!values.passwordConfirm) {
                setErrPasswordConfirm("Nhập lại mật khẩu không được bỏ trống.")
                submit = false
            }
            else if (values.passwordConfirm && values.passwordNew && values.passwordConfirm !== values.passwordNew) {
                setErrPasswordConfirm("Mật khẩu nhập lại không chính xác.")
                submit = false;
            }

            if (submit) {
                const data = {
                    ...context.account,
                    password: values.passwordNew,
                }
                axios.put("http://localhost:8081/login/" + context.account.username, data)
                    .then(res => {
                        context.setAccount(res.data);
                        toast.success("Đổi mật khẩu thành công.")
                        context.setShowLoading(true);
                        if (context.account.positionName === "Giảng viên") {
                            router.push("/Lecture")
                        }
                        else if (context.account.positionName === "Thư ký khoa") {
                            router.push("/FacultySecretary")
                        }
                        else if (context.account.positionName === "Trưởng bộ môn") {
                            router.push("/DepartmentHead")
                        }
                        else {
                            router.push("/Chair")
                        }

                    })
                    .catch(err => {
                        toast.error("Hệ thống xảy ra lỗi.")
                        console.log("Lỗi đổi mật khẩu", err);
                    })
            }
        }
    })

    const handleRollBack = () => {
        context.setShowLoading(true)
        if (context.account.change) {
            context.setAccount(null)
            router.push("/")
        }
        else {
            if (context.account.positionName === "Giảng viên") {
                router.push("/Lecture")
            }
            else if (context.account.positionName === "Thư ký khoa") {
                router.push("/FacultySecretary")
            }
            else if (context.account.positionName === "Trưởng bộ môn") {
                router.push("/DepartmentHead")
            }
            else {
                router.push("/Chair")
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <img className={styles.imgBg} src="https://code.ptit.edu.vn/2020/images/bg_left.png" width={500} height={500} />
            </div>
            <form onSubmit={formik.handleSubmit} className={styles.center}>
                <div className={styles.login}>
                    <Image src="/PTITLOGO.png" width={80} height={80} alt="Logo" className={styles.img} />
                    <p style={{
                        fontSize: "19.2px",
                    }}>Đổi mật khẩu</p>
                    <span style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        marginBottom: "20px",
                    }}>PTITHCM</span>
                    {
                        context.account ?
                            <div className={styles.inputGroup}>
                                <label style={{
                                    fontSize: "14px",
                                    color: "5f5f5f",
                                    fontWeight: "600"
                                }}>Mật khẩu cũ</label>
                                <input type="password" className={styles.input} name='passwordOld' onChange={formik.handleChange} value={formik.values.passwordOld}
                                    onFocus={() => setErrPasswordOld("")}
                                />
                                <span className={styles.err}>{errPasswordOld}</span>
                            </div>
                            : <></>
                    }
                    <div className={styles.inputGroup}>
                        <label style={{
                            fontSize: "14px",
                            color: "5f5f5f",
                            fontWeight: "600"
                        }}>Mật khẩu mới</label>
                        <input type="password" className={styles.input}
                            name='passwordNew' onChange={formik.handleChange}
                            value={formik.values.passwordNew} onFocus={(() => setErrPasswordNew(""))}
                        />
                        <span className={styles.err}>{errPasswordNew}</span>
                    </div>
                    <div className={styles.inputGroup}>
                        <label style={{
                            fontSize: "14px",
                            color: "5f5f5f",
                            fontWeight: "600"
                        }}>Nhập lại mật khẩu</label>
                        <input type="password" className={styles.input}
                            name='passwordConfirm' onChange={formik.handleChange}
                            value={formik.values.passwordConfirm} onFocus={(() => setErrPasswordConfirm(""))}
                        />
                        <span className={styles.err}>{errPasswordConfirm}</span>
                    </div>
                    <button type='submit' style={{ marginTop: "20px" }} className={styles.btnLogin}>Thay đổi</button>
                    <button type='button' style={{
                        marginTop: "10px",
                        background: "#AAC9FF"
                    }} className={styles.btnLogin} onClick={handleRollBack}>Quay lại</button>
                </div>
            </form>
            <div className={styles.right}>
                <img className={styles.imgBg} src="https://code.ptit.edu.vn/2020/images/bg_right.png" alt="" />
            </div>
        </div>
    )
}
