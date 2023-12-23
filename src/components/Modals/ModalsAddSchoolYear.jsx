import { use, useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsAddResearch.module.css'
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';

function ModalsAddSchoolYear(props) {
    const { show, setShow, schoolYear, update, setSchoolYear, setUpdate, change, setChange } = props;
    const [errSchoolYearName, setErrSchoolYear] = useState("");
    const [errAcademicYear, setErrAcademicYear] = useState("");
    const [errDateStart, setErrDateStart] = useState("");
    const [errDateEnd, setErrDateEnd] = useState("");
    const context = useContext(Context);
    const isSchoolYearName = (value) => {
        if (schoolYear) {
            if (value.schoolYearName === schoolYear.schoolYearName)
                return false;
            else
                return context.listSchoolYear.find(item => value.schoolYearName === item.schoolYearName)
        }
        else {
            return context.listSchoolYear.find(item => value.schoolYearName === item.schoolYearName)
        }
    }

    const isSuccess = (dateEnd, dateStart) => {
        for (let index = 0; index < context.listSchoolYear.length; index++) {
            const element = context.listSchoolYear[index];
            const iDateStart = new Date(element.dateStart);
            const iDateEnd = new Date(element.dateEnd);
            if (iDateStart.getTime() < dateEnd.getTime() && iDateStart.getTime() > dateStart.getTime()) {
                //console.log("Vào đây")
                return element;
            }
            if (iDateEnd.getTime() > dateStart.getTime() && iDateEnd.getTime() < dateEnd.getTime()) {
                //console.log("Vl")
                return element;
            }
            if (iDateStart.getTime() < dateStart.getTime() && iDateEnd.getTime() > dateEnd.getTime()) {
                return element;
            }
        }
        return null;
    }

    const handleClose = () => {
        setShow(false);
        setErrAcademicYear("")
        setErrSchoolYear("")
        setErrDateEnd("")
        setErrDateStart("")
        formik.values.id = undefined
        formik.values.schoolYearName = ''
        formik.values.academicYear = 0
        formik.values.dateEnd = ""
        formik.values.dateStart = ""
        if (update) {
            setUpdate(false);
            setSchoolYear(null);
        }
    }

    const formik = useFormik({
        initialValues: {
            schoolYearName: "",
            academicYear: 0,
            id: null,
            dateStart: "",
            dateEnd: "",
        },
        onSubmit: values => {
            let submit = true;
            //console.log("Value trước khi kiểm tra", values)
            if (!values.schoolYearName) {
                setErrSchoolYear("Vui lòng nhập tên khóa");
                submit = false;
            }
            else {
                if (isSchoolYearName(values)) {
                    setErrSchoolYear("Tên niêm khóa này đã được sử dụng")
                    submit = false;
                }
            }
            if (!values.academicYear) {
                setErrAcademicYear("Vui lòng nhâp năm nhập hoc")
                submit = false;
            }
            if (!values.dateStart) {
                setErrDateStart("Vui lòng chọn ngày bắt đầu niên khóa")
                submit = false;
            }
            if (!values.dateEnd) {
                setErrDateEnd("Vui lòng chọn ngày kết thúc niên khóa")
                submit = false
            }
            if (values.dateStart && values.dateEnd) {
                let dateS = new Date(values.dateStart);
                let dateE = new Date(values.dateEnd);
                let element = isSuccess(dateE, dateS);
                if (dateE.getTime() <= dateS.getTime()) {
                    setErrDateEnd("Vui lòng chọn ngày kết thúc lớn hơn ngày bắt đầu " + values.dateStart);
                    submit = false;
                }
                else if (element) {
                    toast.warning("Không thể thực hiện thao tác vì trong ngày " + element.dateStart + " đến ngày " + element.dateEnd +
                        " là thời gian thực hiện đề tài của niên khóa " + element.schoolYearName);
                    submit = false;
                }
            }

            if (submit) {
                //console.log("Value", values)
                if (update) {
                    axios.put("http://localhost:8081/SchoolYear/" + values.id, values)
                        .then(res => {
                            if (res.data.academicYear > context.schoolYearMax.academicYear) {
                                context.setSchoolYearMax(res.data)
                            }
                            toast.success("Cập nhật thành công.")
                            handleClose()
                            setChange(!change)
                        })
                        .catch(err => {
                            console.log(err)
                            toast.error("Hệ thống xảy ra lỗi")
                        })
                }
                else {
                    axios.post("http://localhost:8081/SchoolYear", values)
                        .then(res => {
                            if (res.data.academicYear > context.schoolYearMax.academicYear) {
                                context.setSchoolYearMax(res.data)
                            }
                            toast.success("Thêm thành công.")
                            handleClose();
                            setChange(!change)
                        })
                        .catch(err => {
                            console.log("Lỗi thêm mới niên khóa", err)
                            toast.error("Hệ thống xảy ra lỗi!")
                        })
                }
            }
        }
    })

    useEffect(() => {
        if (schoolYear) {
            formik.handleChange({
                target: {
                    name: "schoolYearName",
                    value: schoolYear.schoolYearName,
                },
            });
            formik.handleChange({
                target: {
                    name: "academicYear",
                    value: schoolYear.academicYear,
                },
            });
            formik.handleChange({
                target: {
                    name: "id",
                    value: schoolYear.id,
                },
            });
            formik.handleChange({
                target: {
                    name: "dateStart",
                    value: schoolYear.dateStart,
                },
            });
            formik.handleChange({
                target: {
                    name: "dateEnd",
                    value: schoolYear.dateEnd,
                },
            });
        }
    }, [schoolYear]);

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
                            <Form.Label className={styles.label}>Tên niên khóa</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder="Nhập tên niên khóa"
                                autoFocus
                                onChange={formik.handleChange}
                                value={formik.values.schoolYearName}
                                name='schoolYearName'
                                onFocus={() => setErrSchoolYear("")}
                            />
                            <span className={styles.errors}>{errSchoolYearName}</span>
                        </Form.Group>
                        {
                            update ?
                                schoolYear.lengthResearch ? <></> :
                                    <Form.Group
                                        className="mb-3"
                                    >
                                        <Form.Label className={styles.label}>Năm nhập học</Form.Label>
                                        <Form.Control
                                            type='number'
                                            inputMode='none'
                                            onChange={formik.handleChange}
                                            value={formik.values.academicYear}
                                            name='academicYear'
                                            onFocus={() => setErrAcademicYear("")}
                                        />
                                        <span className={styles.errors}>{errAcademicYear}</span>
                                    </Form.Group>
                                :
                                <Form.Group
                                    className="mb-3"
                                >
                                    <Form.Label className={styles.label}>Năm nhập học</Form.Label>
                                    <Form.Control
                                        type='number'
                                        inputMode='none'
                                        onChange={formik.handleChange}
                                        value={formik.values.academicYear}
                                        name='academicYear'
                                        onFocus={() => setErrAcademicYear("")}
                                    />
                                    <span className={styles.errors}>{errAcademicYear}</span>
                                </Form.Group>
                        }
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Ngày bắt đầu</Form.Label>
                            <Form.Control
                                type='date'
                                placeholder="Nhập ngày bắt đầu niên khóa"
                                // autoFocus
                                onChange={formik.handleChange}
                                value={formik.values.dateStart}
                                name='dateStart'
                                onFocus={() => setErrDateStart("")}
                            />
                            <span className={styles.errors}>{errDateStart}</span>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className={styles.label}>Ngày kết thúc</Form.Label>
                            <Form.Control
                                type='date'
                                placeholder="Nhập ngày kết thúc niên khóa"
                                //autoFocus
                                onChange={formik.handleChange}
                                value={formik.values.dateEnd}
                                name='dateEnd'
                                onFocus={() => setErrDateEnd("")}
                            />
                            <span className={styles.errors}>{errDateEnd}</span>
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

export default ModalsAddSchoolYear;