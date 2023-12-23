import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';

function ModalsUpFileReport(props) {
    const { show, setShow, setChange, change } = props;
    const [filesReport, setFilesReport] = useState(null);
    const context = useContext(Context);
    let fileName = "";

    const checkDataInput = () => {
        for (var i = 0; i < context.listNameFile.length; i++) {
            for (let index = 0; index < filesReport.length; index++) {

                if (filesReport[index].name.split(".")[0] === context.listNameFile[i]) {
                    fileName = filesReport[index].name
                    return false;
                }
            }
        }

        let int = 1;
        for (let index = 0; index < filesReport.length; index++) {
            const part = filesReport[index].name.split(".")[0];
            fileName = part;
            const str = part?.split("_")
            if (str?.length !== 3) {
                return 3;
            }
            else {
                if (!context.students.find(item => item.studentCode.toLowerCase() === str[0].toLowerCase())) {
                    return 2;
                }
                else if (!/^[a-zA-Z]+$/.test(str[1])) {
                    return 3;
                }
                else if (str[2] !== "BCCK") {
                    return 3;
                }
            }
        }
        return true;
    }

    const checkDataResearch = () => {
        for (let index = 0; index < filesReport.length; index++) {
            const element = filesReport[index];
            const str = element.name.split("_")
            const student = context.students.find(item => item.studentCode.toLowerCase() === str[0].toLowerCase());
            if (student) {
                if (!student.researchId) {
                    fileName = str[0];
                    return element.name;
                }
            }
        }
        return false;
    }

    const checkSize = () => {
        const maxSize = 200 * 1024 * 1024;
        let size = 0;
        for (let index = 0; index < filesReport.length; index++) {
            const element = filesReport[index];
            size += element.size;
        }
        if (maxSize < size) {
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let submit = true;
        if (!filesReport) {
            submit = false;
            toast.warning("Vui lòng nhập file trước khi bấm lưu.")
        }
        else {
            if (!checkDataInput()) {
                submit = false
                toast.warning("Bài báo cáo của sinh viên có mã sinh viên là " + fileName.split("_")[0] + " đã tồn tại trong hệ thống.")
            }
            else if (checkDataInput() === 2) {
                submit = false
                toast.warning("Bài báo cáo " + fileName + " không tồn tại mã sinh viên có mã sinh viên trùng với file báo cáo.")
            }
            else if (checkDataInput() === 3) {
                submit = false
                toast.warning("Bài báo cáo " + fileName + " sai định dạng vui lòng kiểm tra lại định dạng file.")
            }
            if (checkDataResearch()) {
                submit = false;
                toast.warning("Sinh viên có mã sinh viên " + fileName + " chưa được giao đề tài nên không thể có file báo cáo.")
            }
            if (!checkSize()) {
                submit = false;
                toast.warning("Vui lòng nhập danh sách file có tổng dung lượng nhỏ hơn 200MB")
            }
        }
        if (submit) {
            const formData = new FormData();
            //console.log("Test", filesReport);
            for (const file of filesReport) {
                formData.append('files', file);
            }
            context.setShowLoading(true);
            axios.post("http://localhost:8081/uploadFile/report/auto", formData)
                .then(res => {
                    if (res.data) {
                        context.setShowLoading(false);
                    }
                    toast.success("Thêm danh sách file báo cáo thành công.")
                    setChange(!change)
                })
                .catch(err => {
                    context.setShowLoading(false);
                    toast.error("Hệ thống xảy ra lỗi!")
                    console.log("Lỗi upload file báo cáo tự động", err)
                })
            handleClose();
        }
    }
    const handleClose = () => {
        setFilesReport(null)
        fileName = "";
        setShow(false);
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
                                accept='.doc, .pdf, .docx'
                                multiple
                                onChange={
                                    (e) => {
                                        setFilesReport(e.target.files)
                                    }
                                }
                            />
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

export default ModalsUpFileReport;