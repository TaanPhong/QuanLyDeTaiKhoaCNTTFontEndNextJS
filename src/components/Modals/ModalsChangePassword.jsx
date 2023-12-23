"use client"
import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';


function ModalsChangePassword(props) {
    const { show, setShow } = props;
    const [errPasswordOld, setErrPasswordOld] = useState("");
    const [errPasswordNew, setErrPasswordNew] = useState("");
    const [errPasswordConfirm, setErrPasswordConfirm] = useState("");
    const context = useContext(Context);

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
            console.log("passwordNew", values.passwordNew.length)
            if (!values.passwordOld) {
                setErrPasswordOld("Mật khẩu cũ không được bỏ trống!")
                submit = false;
            }
            else if (values.passwordOld != context.account?.password) {
                setErrPasswordOld("Mật khẩu cũ không chính xác.")
                submit = false;
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
                console.log("data", data)
                handleClose();
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
            >
                <Modal.Header closeButton>
                    <Modal.Title>Đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Mật khẩu cũ</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder="Nhập mật khẩu cũ"
                                onChange={formik.handleChange}
                                value={formik.values.passwordOld}
                                name='passwordOld'
                                onFocus={() => setErrPasswordOld("")}
                            />
                            <span className={styles.errors}>{errPasswordOld}</span>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder="Nhập mật khẩu mới"
                                onChange={formik.handleChange}
                                value={formik.values.passwordNew}
                                name='passwordNew'
                                onFocus={() => setErrPasswordNew("")}
                            />
                            <span className={styles.errors}>{errPasswordNew}</span>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Nhập lại mật khẩu</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder="Nhập lại mật khẩu mới"
                                onChange={formik.handleChange}
                                value={formik.values.passwordConfirm}
                                name='passwordConfirm'
                                onFocus={() => setErrPasswordConfirm("")}
                            />
                            <span className={styles.errors}>{errPasswordConfirm}</span>
                        </Form.Group>
                        <div className={styles.footer}>
                            <Button variant="danger" onClick={handleClose} type='button'>
                                Đóng
                            </Button>
                            <Button variant="success" type='submit'>
                                Thay đổi
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalsChangePassword;