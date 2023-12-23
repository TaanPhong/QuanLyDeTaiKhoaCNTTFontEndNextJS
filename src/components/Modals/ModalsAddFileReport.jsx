import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';

function ModalsAddFileReport(props) {
    const { show, setShow, student, change, setChange } = props;
    const [fileReport, setFileReport] = useState(null);
    const context = useContext(Context)
    const [errFile, setErrFile] = useState("")
    const checkName = (part) => {
        if (student.reportFile) {
            const fileName = student.reportFile.split(".");
            if (fileName[0] === part) {
                return null;
            }
        }
        if (context.listNameFile) {
            return context.listNameFile.find(item => item === part)
        }
        return null;
    }

    const checkNameValid = (part) => {
        const str = part.split("_");
        console.log("str", str)
        if (str.length !== 3) {
            return false;
        }
        else {
            if (student.studentCode.toLowerCase() != str[0].toLowerCase()) {
                //console.log("Vào trường hợp này 1")
                return 3;
            }
            else if (!/^[a-zA-Z]+$/.test(str[1])) {
                //console.log("Vào trường hợp này 2")
                return false;
            }
            else if (str[2] !== "BCCK") {
                //console.log("Vào trường hợp này 3")
                return false;
            }
            return true;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let submit = true;
        if (!fileReport) {
            submit = false;
            setErrFile("Vui lòng nhập file")
        }
        else {
            const part = fileReport.name.split(".")
            if (checkName(part[0])) {
                submit = false;
                setErrFile("Tập tin này đã tồn tại trong hệ thống.")
            }
            else if (!checkNameValid(part[0])) {
                submit = false;
                setErrFile("Tên file không đúng định dạng.")
            }
            else if (checkNameValid(part[0]) == 3) {
                submit = false;
                setErrFile("Tên file không mã sinh viên của đối tượng.")
            }
        }
        if (submit) {
            const formData = new FormData();
            formData.append("file", fileReport);
            context.setShowLoading(true)
            if (student.reportDocumentCode) {
                axios.delete("http://localhost:8081/uploadFileReport/" + student.reportDocumentCode + "/" + student.researchId)
                    .then(response => {
                        axios.post("http://localhost:8081/uploadFile/repost/" + student.studentCode, formData)
                            .then(res => {
                                if (res.data) {
                                    context.setShowLoading(false);
                                }
                                toast.success("Cập nhật file báo cáo thành công.")
                                setChange(!change)
                            })
                            .catch(err => {
                                toast.error("Hệ thống xảy ra lỗi!")
                                console.log("Lỗi upload file student", err)
                            })
                    })
                    .catch(err => {
                        toast.error("Hệ thống xảy ra lỗi!")
                        console.log("Lỗi xóa file student", err)
                    })
            }
            else {
                axios.post("http://localhost:8081/uploadFile/repost/" + student.studentCode, formData)
                    .then(res => {
                        if (res.data) {
                            context.setShowLoading(false);
                        }
                        toast.success("Cập nhật file báo cáo thành công.")
                        setChange(!change)
                    })
                    .catch(err => {
                        toast.error("Hệ thống xảy ra lỗi!")
                        console.log("Lỗi upload file student", err)
                    })
            }
            handleClose();
        }
    }
    const handleClose = () => {
        setShow(false);
        setFileReport(null);
        setErrFile("")
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Nhập file</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Nhập file</Form.Label>
                            <Form.Control
                                type='file'
                                autoFocus
                                name='file'
                                accept='.doc, .pdf, .docx'
                                onChange={
                                    (e) => {
                                        setFileReport(e.target.files[0])
                                        setErrFile("")
                                    }
                                }

                            />
                            <span className={styles.errors}>{errFile}</span>
                        </Form.Group>
                        <span>Tên file: Mã sinh viên_Họ tên_BCCK</span>
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

export default ModalsAddFileReport;