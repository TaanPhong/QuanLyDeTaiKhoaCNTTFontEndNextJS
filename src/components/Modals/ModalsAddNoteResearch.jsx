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


function ModalsAddNoteResearch({ showModals, setShowModals, deleted, research, change, setChange, setSelected }) {
    const [errNote, setErrNote] = useState("");
    const context = useContext(Context)
    const formik = useFormik({
        initialValues: {
            note: ""
        },
        onSubmit: values => {
            let submit = true;
            if (!values.note) {
                submit = false
                setErrNote("Vui lòng nhập nhận xét")
            }
            if (submit) {
                const data = {
                    ...research,
                    note: values.note,
                }
                console.log("data", data)
                handleOnClickRevise(data)
                handleClose()
            }
        },
    });
    const handleClose = () => {
        setShowModals(false);
        formik.values.note = ''
        setErrNote("")
    }

    const handleOnClickRevise = (data) => {
        let status = 3;
        if (deleted) {
            status = 4
        }
        axios.post("http://localhost:8081/research/updateOrCancel/revise/" + status + "/" + context.account?.username, data)
            .then((res) => {
                if (deleted) {
                    toast.success("Yêu cầu hủy thành công.")
                }
                else {
                    toast.success("Yêu cầu cập nhật thành công.")
                }
                setChange(!change)
                setSelected([])
            })
            .catch((err) => {
                toast.warning("Xảy ra lỗi!")
                console.log("Lỗi cập nhật trạng thái của đề tài", err)
            })
    }

    return (
        <>
            <Modal show={showModals} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{!deleted ? "Yêu cầu chỉnh sửa" : "Yêu cầu hủy đề tài"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>{"Tên đề tài: " + research?.researchName}</Form.Label>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Nhận xét</Form.Label>
                            <Form.Control as="textarea" rows={5}
                                onChange={formik.handleChange}
                                value={formik.values.note}
                                name='note'
                                onFocus={() => setErrNote("")}
                            />
                            <span className={styles.errors}>{errNote}</span>
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

export default ModalsAddNoteResearch;