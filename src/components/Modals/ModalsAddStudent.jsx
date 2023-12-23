import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';

function ModalsAddStudent(props) {
    const { show, setShow, student, update, setStudent, setUpdate, change, setChange, classesCode } = props;
    const [errSurname, setErrSurname] = useState("");
    const [errFirstName, setErrFirstName] = useState("");
    const [errNumberPhone, setErrNumberPhone] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [errStudentCode, setErrStudentCode] = useState("");
    const context = useContext(Context);

    const isNumberPhone = (value) => {
        if (student) {
            if (value === student.numberPhone) {
                return false;
            }
            else {
                return context.students.find(item => value === item.numberPhone)
            }
        }
        else {
            return context.students.find(item => value === item.numberPhone)
        }
    }

    const isEmail = (value) => {
        if (student) {
            if (value === student.email) {
                return false;
            }
            else {
                return context.students.find(item => value === item.email)
            }
        }
        else {
            return context.students.find(item => value === item.email);
        }
    }

    const isStudentCode = (value) => {
        return context.students.find(item => value === item.studentCode)
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
        formik.values.studentCode = '';
        if (update) {
            setUpdate(false);
            setStudent(null);

        }
    }

    const formik = useFormik({
        initialValues: {
            surname: "",
            firstName: "",
            gender: "Nam",
            email: '',
            numberPhone: '',
            studentCode: "",
        },
        onSubmit: values => {
            let submit = true;
            if (!student && !values.studentCode) {
                setErrStudentCode("Vui lòng nhập mã sinh viên.")
                submit = false;
            }
            else if (!student && isStudentCode(values.studentCode.toUpperCase())) {
                setErrStudentCode("Mã sinh viên này đã được sử dụng!")
                submit = false;
            }
            if (!values.surname) {
                setErrSurname("Vui lòng nhập họ sinh viên");
                submit = false;
            }
            if (!values.firstName) {
                setErrFirstName("Vui lòng nhâp tên sinh viên")
                submit = false;
            }
            if (!values.email) {
                setErrEmail("Vui lòng nhập email của sinh viên");
                submit = false;
            }
            else {
                if (isEmail(values.email)) {
                    setErrEmail("Email này đã được sử dụng!")
                    submit = false;
                }
            }
            if (!values.numberPhone) {
                setErrNumberPhone("Vui lòng nhập số điện thoại của sinh viên");
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
                if (isNumberPhone(values.numberPhone)) {
                    setErrNumberPhone("Số điện thoại này đã có sinh viên sử dụng")
                    submit = false
                }
            }
            if (submit) {
                const data = {
                    ...values,
                    studentCode: values.studentCode.toUpperCase(),
                    classCode: classesCode,
                    email: values.email.toLowerCase(),
                }
                if (update) {
                    axios.put("http://localhost:8081/student/" + student.studentCode, data)
                        .then(res => {
                            toast.success("Cập nhật sinh viên thành công.")
                            setChange(!change)
                            handleClose();
                        })
                        .catch(err => {
                            toast.error("Hệ thống xảy ra lỗi!")
                            console.log("Lỗi cập nhật sinh viên", err);
                        })
                }
                else {
                    axios.post("http://localhost:8081/student", data)
                        .then(res => {
                            toast.success("Thêm sinh viên thành công.")
                            setChange(!change)
                            handleClose();
                        })
                        .catch(err => {
                            toast.error("Hệ thống xảy ra lỗi!")
                            console.log("Lỗi thêm sinh viên", err);
                        })
                }
            }
        }
    })

    console.log("ClassCode", classesCode)

    useEffect(() => {
        if (student) {
            formik.handleChange({
                target: {
                    name: "gender",
                    value: student.gender,
                },
            });
            formik.handleChange({
                target: {
                    name: "surname",
                    value: student.surname,
                },
            });
            formik.handleChange({
                target: {
                    name: "firstName",
                    value: student.firstName,
                },
            });
            formik.handleChange({
                target: {
                    name: "email",
                    value: student.email,
                },
            });
            formik.handleChange({
                target: {
                    name: "numberPhone",
                    value: student.numberPhone,
                },
            });
            formik.handleChange({
                target: {
                    name: "studentCode",
                    value: student.studentCode,
                },
            });
            formik.handleChange({
                target: {
                    name: "gender",
                    value: student.gender,
                },
            });
        }
    }, [student]);

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{!update ? "Thêm sinh viên" : "Cập nhật sinh viên"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        {
                            !update ?
                                <Form.Group className="mb-3">
                                    <Form.Label className={styles.label}>Mã sinh viên</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="Nhập mã sinh viên"
                                        autoFocus
                                        onChange={formik.handleChange}
                                        value={formik.values.studentCode}
                                        name='studentCode'
                                        onFocus={() => setErrStudentCode("")}
                                    />
                                    <span className={styles.errors}>{errStudentCode}</span>
                                </Form.Group>
                                : <></>
                        }
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Họ sinh viên</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder="Nhập họ sinh viên"
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
                            <Form.Label className={styles.label}>Tên sinh viên</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Nhập tên sinh viên'
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

export default ModalsAddStudent;