"use client"
import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/style/modalsForgetPassword.module.css'
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';
import { UilUserCircle, UilTimes, UilAngleLeftB } from '@iconscout/react-unicons'


function ModalsForgetPassword(props) {
    const { show, setShow } = props;
    const [errEmail, setErrEmail] = useState("");
    const context = useContext(Context);

    const handleClose = () => {
        setShow(false);
        setErrEmail("")
        formik.values.email = ""
    }

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        onSubmit: values => {
            let submit = true;
            if (!values.email) {
                setErrEmail("Email không được bỏ trống.")
                submit = false
            }
            if (submit) {
                context.setShowLoading(true);
                axios.get("http://localhost:8081/login/forget/" + values.email)
                    .then(res => {
                        if (res.data) {
                            toast.success("Một email đã được gửi vào địa chỉ mail của bạn.")
                            handleClose();
                            context.setShowLoading(false);
                        }
                        else {
                            setErrEmail("Email không tồn tại.")
                        }
                    })
                    .catch(err => {
                        context.setShowLoading(false)
                        toast.error("Hệ thống xảy ra lỗi!")
                        console.log("lỗi quên mật khẩu", err)
                    })
            }
        }
    })

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                size='lg'
            >
                <div className={styles.containerLogin}>
                    <div className={styles.leftLogin}>
                        <div className={styles.navLogin}>
                            <h3>Đặt lại mật khẩu</h3>
                        </div>
                        <div className={styles.fe}>
                            <p>Bạn vui lòng hoàn tất các thông tin xác thực bên dưới để chúng tôi đặt lại mật khẩu cho tài khoản của bạn</p>
                        </div>
                        <form onSubmit={formik.handleSubmit} className={styles.form}>
                            <div className={styles.inputLogin}>
                                <input name='email' onChange={formik.handleChange} value={formik.values.email} type="text" id='forgetPassword' onFocus={() => setErrEmail("")} placeholder='Email hoặc tên đăng nhập' />
                                <span className={styles.error_message}>{errEmail}</span>
                            </div>
                            <button type='submit' className={styles.btn_Login}>Đặt lại mật khẩu</button>
                        </form>
                        <div className={styles.rollBack}>
                            <UilAngleLeftB />
                            <span className={styles.linkForgetPassword} onClick={() => setShow(false)}>Quay lại trang đăng nhập</span>
                        </div>
                    </div>
                    <div className={styles.rightLogin}>
                        <div style={{
                            alignSelf: 'flex-end', cursor: 'pointer',
                        }} onClick={handleClose}>
                            <UilTimes />
                        </div>
                        <img src="https://cdn.divineshop.vn/static/c92dc142033ca6a66cda62bc0aec491b.svg" alt="" />
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ModalsForgetPassword;