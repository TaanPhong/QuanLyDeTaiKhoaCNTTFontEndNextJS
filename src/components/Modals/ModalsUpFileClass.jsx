import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';

function ModalsUpFileClass(props) {
    const { show, setShow, change, setChange } = props;
    const [fileExcel, setFileExcel] = useState();
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", fileExcel);
        axios.post("http://localhost:8081/upload-file/class", formData)
            .then(res => {
                //console.log(res.data)
                toast.success("Import file lớp học thành công.")
                setChange(!change);
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi!")
                console.log("Lỗi upload file student", err)
            })
        handleClose();
    }
    const handleClose = () => {
        setShow(false);
    }

    const setFile = (input) => {
        const data = {
            file: input,
        }
        setFileExcel(data)
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
                                accept='.xlsx, .xls, .xlsm, .xlm'
                                name='file'
                                onChange={
                                    (e) => {
                                        setFileExcel(e.target.files[0])
                                    }
                                }
                            />
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

export default ModalsUpFileClass;