import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';

function ModalsAddLecture(props) {
    const { show, setShow, lecture, update, setLecture, setUpdate, change, setChange } = props;
    const [errSurname, setErrSurname] = useState("");
    const [errFirstName, setErrFirstName] = useState("");
    const [errNumberPhone, setErrNumberPhone] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const context = useContext(Context);

    const isNumberPhone = (value) => {
        if (lecture) {
            if (value.numberPhone === lecture.numberPhone) {
                return false;
            }
            else {
                return context.lectures.find(item => value.numberPhone === item.numberPhone)
            }
        }
        else {
            return context.lectures.find(item => value.numberPhone === item.numberPhone)
        }
    }

    const isEmail = (value) => {
        if (lecture) {
            if (value === lecture.email) {
                return false;
            }
            else {
                return context.lectures.find(item => value === item.email)
            }
        }
        else {
            return context.lectures.find(item => value === item.email);
        }
    }

    const handleClose = () => {
        setShow(false);
        setErrSurname("")
        setErrFirstName("")
        setErrEmail("")
        setErrNumberPhone("")
        formik.values.surname = ""
        formik.values.firstName = ''
        formik.values.gender = "Nam"
        formik.values.email = ""
        formik.values.numberPhone = ''
        formik.values.positionName = context.listPosition[0]?.namePosition
        formik.values.subjectName = context.subjects[0]?.subjectName
        formik.values.id = null
        if (update) {
            setUpdate(false);
            setLecture(null);
        }
    }

    const formik = useFormik({
        initialValues: {
            surname: "",
            firstName: "",
            gender: "Nam",
            email: '',
            numberPhone: '',
            positionName: '',
            subjectName: '',
            id: null,
        },
        onSubmit: values => {
            let submit = true;
            if (!values.surname) {
                setErrSurname("Vui lòng nhập họ giảng viên");
                submit = false;
            }
            if (!values.firstName) {
                setErrFirstName("Vui lòng nhâp tên giảng viên")
                submit = false;
            }
            if (!values.email) {
                setErrEmail("Vui lòng nhập email của giảng viên");
                submit = false;
            }
            else {
                if (isEmail(values.email)) {
                    setErrEmail("Email này đã được sử dụng!")
                    submit = false;
                }
            }
            if (!values.numberPhone) {
                setErrNumberPhone("Vui lòng nhập số điện thoại của giảng viên");
                submit = false;
            }
            else if (!/^[0-9]+$/.test(values.numberPhone)) {
                setErrNumberPhone("Số điện thoại chỉ nhận ký tự số")
                submit = false;
            }
            else if (values.numberPhone.length != 10) {
                setErrNumberPhone("Số điện thoại là một chuỗi số gồm 10 chữ số")
                submit = false;
            }
            else {
                if (isNumberPhone(values)) {
                    setErrNumberPhone("Số điện thoại này đã có giảng viên sử dụng")
                    submit = false
                }
            }
            if (submit) {
                if (update) {
                    axios.put("http://localhost:8081/lectures/" + lecture.id, values)
                        .then(res => {
                            toast.success("Cập nhật thông tin thành công.")
                            handleClose();
                            setChange(!change);
                        })
                        .catch(err => {
                            toast.error("Hệ thống xảy ra lỗi!")
                            console.log("Lỗi sửa giảng viên", err)
                        })
                }
                else {
                    axios.post("http://localhost:8081/lectures", values)
                        .then(res => {
                            toast.success("Thêm giảng viên thành công")
                            handleClose();
                            setChange(!change);
                        })
                        .catch(err => {
                            toast.error("Hệ thống xảy ra lỗi!")
                            console.log("Lỗi thêm giảng viên", err)
                        })
                }
            }
        }
    })

    useEffect(() => {
        formik.handleChange({
            target: {
                name: "subjectName",
                value: context.subjects[0]?.subjectName,
            }
        })
    }, [context.subjects])

    useEffect(() => {
        formik.handleChange({
            target: {
                name: "positionName",
                value: context.listPosition[0]?.namePosition,
            }
        })
    }, [context.listPosition])

    useEffect(() => {
        if (lecture) {
            formik.handleChange({
                target: {
                    name: "surname",
                    value: lecture.surname,
                },
            });
            formik.handleChange({
                target: {
                    name: "firstName",
                    value: lecture.firstName,
                },
            });
            formik.handleChange({
                target: {
                    name: "email",
                    value: lecture.email,
                },
            });
            formik.handleChange({
                target: {
                    name: "numberPhone",
                    value: lecture.numberPhone,
                },
            });
            formik.handleChange({
                target: {
                    name: "positionName",
                    value: lecture.positionName,
                },
            });
            formik.handleChange({
                target: {
                    name: "subjectName",
                    value: lecture.subjectName,
                },
            });
            formik.handleChange({
                target: {
                    name: "id",
                    value: lecture.id,
                },
            });
        }
    }, [lecture]);

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{!update ? "Thêm niên khóa" : "Cập nhật niên khóa"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Họ giảng viên</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder="Nhập họ giảng viên"
                                autoFocus
                                onChange={formik.handleChange}
                                value={formik.values.surname}
                                name='surname'
                                onFocus={() => setErrSurname("")}
                            />
                            <span className={styles.errors}>{errSurname}</span>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Tên giảng viên</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Nhập tên giảng viên'
                                onChange={formik.handleChange}
                                value={formik.values.firstName}
                                name='firstName'
                                onFocus={() => setErrFirstName("")}
                            />
                            <span className={styles.errors}>{errFirstName}</span>
                        </Form.Group>
                        {
                            !update ? <Form.Group
                                className="mb-3"
                            >
                                <Form.Label className={styles.label}>Email</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='nhập email'
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    name='email'
                                    onFocus={() => setErrEmail("")}
                                />
                                <span className={styles.errors}>{errEmail}</span>
                            </Form.Group> :
                                <></>
                        }
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Số điện thoại</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Nhập số điện thoại'
                                inputMode='none'
                                onChange={formik.handleChange}
                                value={formik.values.numberPhone}
                                name='numberPhone'
                                onFocus={() => setErrNumberPhone("")}
                            />
                            {/* <input type="file" id='phong' multiple="multiple" /> */}
                            <span className={styles.errors}>{errNumberPhone}</span>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Giới tính</Form.Label>
                            <Form.Select name="gender" onChange={formik.handleChange} value={formik.values.gender}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Chức vụ</Form.Label>
                            <Form.Select name="positionName" value={formik.values.positionName} onChange={formik.handleChange}>
                                {
                                    context.listPosition.map(item => {
                                        return <option value={item.namePosition}>{item.namePosition}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                        >
                            <Form.Label className={styles.label}>Bộ môn</Form.Label>
                            <Form.Select name="subjectName" value={formik.values.subjectName} onChange={formik.handleChange}>
                                {
                                    context.subjects.map(item => {
                                        return <option value={item.subjectName}>{item.subjectName}</option>
                                    })
                                }
                            </Form.Select>
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

export default ModalsAddLecture;