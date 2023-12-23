import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';

function ModalsUpdateResearch(props) {
    const { show, setShow, student, change, setChange } = props;
    const context = useContext(Context);
    const [researches, setResearches] = useState([]);

    useEffect(() => {
        if (student) {
            axios.get("http://localhost:8081/research/enligible/" + student?.subjectCode)
                .then(res => {
                    setResearches(res.data);
                })
                .catch(err => {
                    toast.error("Quá trình lấy dữ liệu đề tài xảy ra lỗi!")
                    console.log("Lỗi lấy đề tài giao đề tài: ", err)
                })
        }
    }, [student])

    useEffect(() => {
        if (student?.researchID) {
            formik.handleChange(
                {
                    target: {
                        name: "researchID",
                        value: student?.researchId
                    }
                }
            )
        }
    }, [student])

    useEffect(() => {
        formik.handleChange(
            {
                target: {
                    name: "researchID",
                    value: researches[0]?.researchID
                }
            }
        )
    }, [researches])

    const handleClose = () => {
        setShow(false);
    }

    const formik = useFormik({
        initialValues: {
            researchID: ""
        },
        onSubmit: values => {
            if (researches.length) {
                if (values.researchID != student.researchId) {
                    axios.put("http://localhost:8081/assginment/" + student?.studentCode + "/" + values.researchID + "/"
                        + context.account?.username
                    )
                        .then(res => {
                            setChange(!change)
                            toast.success("Giao đề tài thành công.")
                        })
                        .catch(err => {
                            toast.error("Gặp lỗi trong quá trình chuyển đổi đề tài")
                            console.log("Lỗi đổi đề tài sinh viên", err);
                        })
                }
            }
            handleClose();
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
                    <Modal.Title>Giao đề tài cho sinh viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Danh sách đề tài</Form.Label>
                            {
                                researches.length === 0 ?
                                    <p>Hiện tại bộ môn này chưa có để tài đủ điều kiện</p>
                                    :
                                    <Form.Select name="researchID" onChange={formik.handleChange} value={formik.values.researchID}>
                                        {
                                            researches?.map(item => {
                                                return <option value={item.researchID}>{item.researchName}</option>
                                            })
                                        }
                                    </Form.Select>
                            }

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

export default ModalsUpdateResearch;