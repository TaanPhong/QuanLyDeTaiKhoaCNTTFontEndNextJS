import axios from 'axios'
import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { toast } from 'react-toastify';

const ExportFile = () => {
    const handleClickExcel = () => {
        axios.get("http://localhost:8081/statistical/excel", {
            responseType: 'blob', // Để xác định dữ liệu trả về là file
        })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "statisticalTotal.xlsx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi")
                console.log("Lỗi xuất file", err)
            })
    }

    const handleClickPDF = () => {
        axios.get("http://localhost:8081/statistical/pdf", { responseType: "blob" })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "statisticalTotal.pdf");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err => alert("Hệ thống gặp lỗi"))
    }

    return (
        <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Xuất file
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={handleClickExcel}>Xuất file excel</Dropdown.Item>
                <Dropdown.Item onClick={handleClickPDF}>Xuất file pdf</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ExportFile