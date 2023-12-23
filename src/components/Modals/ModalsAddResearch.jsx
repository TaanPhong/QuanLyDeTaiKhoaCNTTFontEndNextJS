"use client"
import { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';


function CreateResearch({ showModals, setShowModals, update, setUpdate, research, setResearch, change, setChange }) {
    const [errResearchName, setErrResearchName] = useState("");
    const [errTheoreticalContent, setErrTheoreticalContent] = useState("");
    const [errPracticeContext, setErrPracticeContext] = useState("");
    const context = useContext(Context)
    //console.log("research", research)
    const formik = useFormik({
        initialValues: {
            researchName: research?.researchName ? research.researchName : "",
            theoreticalContent: research?.theoreticalContent ? research.theoreticalContent : "",
            practiceContext: research?.practiceContext ? research.practiceContext : "",
            schoolYearName: research?.schoolYearName ? research.schoolYearName : "",
            researchStatusName: research?.researchStatusName ? research.researchStatusName : "",
        },
        onSubmit: values => {
            let submit = true;
            if (!values.researchName) {
                setErrResearchName("Vui lòng nhập tên đề tài!")
                submit = false;
            }
            if (!values.theoreticalContent) {
                setErrTheoreticalContent("Vui lòng nhập nội dung lý thuyết!")
                submit = false;
            }
            if (!values.practiceContext) {
                setErrPracticeContext("Vui lòng nhập nội dung thực hành!")
                submit = false;
            }
            if (submit) {
                if (update) {
                    if (research.researchStatusName === "Chỉnh sửa") {
                        const data = {
                            ...values,
                            researchID: research.researchID,
                        }
                        axios.post("http://localhost:8081/research/updateOrCancel/revise/" + 5 + "/" + context.account?.username, data)
                            .then(res => {
                                setChange(!change)
                                toast.success("Cập nhật thành công.")
                            })
                            .catch(err => {
                                toast.error("Hệ thống xảy 11 ra lỗi!")
                                console.log("Lỗi cập nhật đang chỉnh sửa", err)
                            })
                    }
                    else {
                        console.log("test value", values)
                        axios.put("http://localhost:8081/research/" + research.researchID, values)
                            .then((res) => {
                                setChange(!change);
                                toast.success("Cập nhật thành công.")
                                //setSelected([])
                            })
                            .catch((errors) => {
                                console.log(errors);
                                toast.warning("Quá trình thêm xảy ra lỗi.")
                            })
                    }
                }
                else {
                    axios.post("http://localhost:8081/" + context.account?.username, values)
                        .then((res) => {
                            setChange(!change);
                            toast.success("Thêm thành công.")
                            //setSelected([])
                        })
                        .catch((errors) => {
                            console.log(errors);
                            toast.warning("Quá trình thêm xảy ra lỗi.")
                        })
                }
                //console.log("Test ", values)
                handleClose();
            }
        },
    });
    const handleClose = () => {
        setShowModals(false);
        formik.values.practiceContext = ''
        formik.values.theoreticalContent = ''
        formik.values.researchName = ''
        if (update) {
            setUpdate(!update);
            setResearch(null);
        }
    }

    useEffect(() => {
        if (research) {
            formik.handleChange({
                target: {
                    name: "researchName",
                    value: research.researchName,
                },
            });
            formik.handleChange({
                target: {
                    name: "schoolYearName",
                    value: research.schoolYearName,
                },
            });
            formik.handleChange({
                target: {
                    name: "theoreticalContent",
                    value: research.theoreticalContent,
                },
            });
            formik.handleChange({
                target: {
                    name: "practiceContext",
                    value: research.practiceContext,
                },
            });
            formik.handleChange({
                target: {
                    name: "researchStatusName",
                    value: research.researchStatusName,
                },
            });
        }
        else {
            formik.handleChange({
                target: {
                    name: "researchName",
                    value: "",
                },
            });
            formik.handleChange({
                target: {
                    name: "theoreticalContent",
                    value: "",
                },
            });
            formik.handleChange({
                target: {
                    name: "practiceContext",
                    value: "",
                },
            });
            formik.handleChange({
                target: {
                    name: "schoolYearName",
                    value: context.schoolYearMax?.schoolYearName,
                },
            });
        }
    }, [research]);

    return (
        <>
            <Modal show={showModals} onHide={handleClose} backdrop="static" size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{!update ? "Thêm mới đề tài" : "Sửa đề tài"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Tên đề tài</Form.Label>
                            <Form.Control
                                as="textarea" rows={3}
                                placeholder="Nhập tên đề tài"
                                autoFocus
                                onChange={formik.handleChange}
                                value={formik.values.researchName}
                                name='researchName'
                                onFocus={() => setErrResearchName("")}
                            />
                            <span className={styles.errors}>{errResearchName}</span>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Nội dung lý thuyết</Form.Label>
                            <Form.Control as="textarea" rows={5}
                                onChange={formik.handleChange}
                                value={formik.values.theoreticalContent}
                                name='theoreticalContent'
                                onFocus={() => setErrTheoreticalContent("")}
                            />
                            <span className={styles.errors}>{errTheoreticalContent}</span>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Nội dung thực hành</Form.Label>
                            <Form.Control as="textarea" rows={5}
                                onChange={formik.handleChange}
                                value={formik.values.practiceContext}
                                name='practiceContext'
                                onFocus={() => setErrPracticeContext('')}
                            />
                            <span className={styles.errors}>{errPracticeContext}</span>
                        </Form.Group>
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

export default CreateResearch;