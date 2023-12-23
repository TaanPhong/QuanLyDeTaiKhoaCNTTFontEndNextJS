import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from '@/components/Modals/ModalsDetail.module.css'

function ModalsResearchDetail(props) {
    const { show, setShow, research, setResearch } = props;
    const handleClose = () => {
        setResearch(null);
        setShow(false);
    }
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đề tài</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.row}>
                        <span>
                            <strong>Tên đề tài:</strong> {research?.researchName}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span>
                            <strong>Bộ môn:</strong> Công nghệ phầm mềm
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span>
                            <strong>Sinh viên thực hiện:</strong> {research?.fullNameStudent ? research.fullNameStudent : "Chưa có"}
                        </span>
                    </div>
                    <div className={styles.rowText}>
                        <span>
                            <strong>Nội dung lý thuyết:</strong>
                        </span>
                        <textarea className={styles.textArea} value={research?.theoreticalContent} id="" cols="30" rows="7" disabled={false}></textarea>
                    </div>
                    <div className={styles.rowText}>
                        <span>
                            <strong>Nội dung thực hành:</strong>
                        </span>
                        <textarea className={styles.textArea} value={research?.practiceContext} id="" cols="30" rows="7" disabled={false}></textarea>
                    </div>
                    {
                        research?.note ? <div className={styles.rowText}>
                            <span>
                                <strong>Nhận xét:</strong>
                            </span>
                            <textarea className={styles.textArea} value={research?.note} id="" cols="30" rows="7" disabled={false}></textarea>
                        </div>
                            : <></>
                    }
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalsResearchDetail;