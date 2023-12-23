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

function ModalsAddClass(props) {
    const { show, setShow, classes, update, setClasses, change, setChange, setUpdate } = props;
    const [errClassCode, setErrClassCode] = useState("");
    const [errClassName, setErrClassName] = useState("");
    const context = useContext(Context);

    const isClassCode = (value) => {
        if (classes) {
            if (value === classes.classCode) {
                return false;
            }
            else {
                return context.classes.find(item => value === item.classCode)
            }
        }
        else {
            return context.classes.find(item => value === item.classCode)
        }
    }

    const isClassName = (value) => {
        if (classes) {
            if (value === classes.className) {
                return false;
            }
            else {
                return context.classes.find(item => value === item.className)
            }
        }
        else {
            return context.classes.find(item => value === item.className);
        }
    }

    const handleClose = () => {
        setShow(false);
        setErrClassCode("")
        setErrClassName("")
        formik.values.classCode = ""
        formik.values.className = ''
        if (update) {
            setUpdate(false);
            setClasses(null);
        }
    }

    const formik = useFormik({
        initialValues: {
            classCode: "",
            className: "",
            subjectName: context.subjects[0]?.subjectName,
        },
        onSubmit: values => {
            let submit = true;
            if (!classes && !values.classCode) {
                setErrClassCode("Vui lòng nhập mã lớp.")
                submit = false;
            }
            else if (!classes && isClassCode(values.classCode.toUpperCase())) {
                setErrClassCode("Mã lớp này đã được sử dụng!")
                submit = false;
            }
            if (!values.className) {
                setErrClassName("Vui lòng nhập tên lớp");
                submit = false;
            }
            else if (!classes && isClassName(values.className)) {
                setErrClassName("Tên lớp này đã được sử dụng!")
                submit = false;
            }
            if (submit) {
                const data = {
                    classCode: values.classCode.toUpperCase(),
                    ...values,
                }
                if (update) {
                    axios.put("http://localhost:8081/class/" + classes.classCode, data)
                        .then(res => {
                            toast.success("Cập nhật lớp thành công.")
                            setChange(!change)
                            handleClose();
                        })
                        .catch(err => {
                            toast.error("Hệ thống xảy ra lỗi!")
                            console.log("Lỗi cập nhật lớp", err);
                        })
                }
                else {
                    axios.post("http://localhost:8081/class", data)
                        .then(res => {
                            toast.success("Thêm lớp thành công.")
                            setChange(!change)
                            handleClose();
                        })
                        .catch(err => {
                            toast.error("Hệ thống xảy ra lỗi!")
                            console.log("Lỗi thêm lớp", err);
                        })
                }
            }
        }
    })

    useEffect(() => {
        if (classes) {
            formik.handleChange({
                target: {
                    name: "classCode",
                    value: classes.classCode,
                },
            });
            formik.handleChange({
                target: {
                    name: "className",
                    value: classes.className,
                },
            });
            formik.handleChange({
                target: {
                    name: "subjectName",
                    value: classes.subjectName,
                },
            });
        }
    }, [classes]);

    useEffect(() => {
        formik.handleChange({
            target: {
                name: "subjectName",
                value: context.subjects[0]?.subjectName,
            },
        });
    }, [context.subjects])

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{!update ? "Thêm lớp" : "Cập nhật lớp"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        {
                            !update ?
                                <Form.Group className="mb-3">
                                    <Form.Label className={styles.label}>Mã lớp</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="Nhập mã lớp"
                                        autoFocus
                                        onChange={formik.handleChange}
                                        value={formik.values.classCode}
                                        name='classCode'
                                        onFocus={() => setErrClassCode("")}
                                    />
                                    <span className={styles.errors}>{errClassCode}</span>
                                </Form.Group>
                                : <></>
                        }
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Tên lớp</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder="Nhập tên lớp"
                                onChange={formik.handleChange}
                                value={formik.values.className}
                                name='className'
                                onFocus={() => setErrClassName("")}
                            />
                            <span className={styles.errors}>{errClassName}</span>
                        </Form.Group>
                        {
                            update ? classes.studentDTOs ? <></>
                                :
                                <Form.Group
                                    className="mb-3"
                                >
                                    <Form.Label className={styles.label}>Bộ môn</Form.Label>
                                    <Form.Select name="subjectName" onChange={formik.handleChange} value={formik.values.subjectName}>
                                        {
                                            context.subjects.map(item => {
                                                return <option value={item.subjectName}>{item.subjectName}</option>
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                                :
                                <Form.Group
                                    className="mb-3"
                                >
                                    <Form.Label className={styles.label}>Bộ môn</Form.Label>
                                    <Form.Select name="subjectName" onChange={formik.handleChange} value={formik.values.subjectName}>
                                        {
                                            context.subjects.map(item => {
                                                return <option value={item.subjectName}>{item.subjectName}</option>
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                        }
                        <div className={styles.footer}>
                            <Button variant="secondary" onClick={handleClose} type='button'>
                                Đóng
                            </Button>
                            <Button variant="primary" type='submit'>
                                Lưu
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalsAddClass;