"use client"
import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale, // x axis
    LinearScale,
    Legend, // y axis
} from 'chart.js'
import { Chart } from "react-chartjs-2"
import axios from 'axios';
import { toast } from 'react-toastify';
ChartJS.register(
    BarElement,
    CategoryScale, // x axis
    LinearScale, // y axis
    Legend,
);

export default function StatisticalResearchSubject(props) {
    const { schoolYearId, academicYear } = props;
    const [subjectResearch, setSubjectResearch] = useState([]);
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: "Thống kê danh sách đề tài theo bộ môn",
                data: [],
                backgroundColor: ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00", "#000000"],
                fill: true
            },
        ],
    })
    useEffect(() => {
        axios.get("http://localhost:8081/statistical/subject/research/" + schoolYearId)
            .then(res => {
                setSubjectResearch(res.data)
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi.")
                console.log("Lỗi lấy thống kê năm đề tài", err)
            })
    }, [schoolYearId])

    useEffect(() => {
        const dataLabels = subjectResearch.map(item => {
            return item.subject_code
        })
        const dataNumberResearch = subjectResearch.map(item => {
            return item.number_research
        })
        const dataNumberComplete = subjectResearch.map(item => {
            return item.numberComplete
        })
        setData({
            labels: dataLabels,
            datasets: [
                {
                    label: "Tổng số đề tài được giao",
                    data: dataNumberResearch,
                    backgroundColor: "#00ff00",
                    fill: true
                },
                {
                    label: "Số sinh viên hoàn thành",
                    data: dataNumberComplete,
                    backgroundColor: "#0000ff",
                    fill: true
                },
            ],
        })
    }, [subjectResearch])

    const options = {
        plugin: {
            legend: true
        }
    }

    return (
        <div style={{
            height: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Chart type='bar' data={data} options={options} />
            <span style={{
                fontSize: "20px",
                marginTop: "20px",
                fontWeight: "600",
                marginBottom: "30px"
            }}> <i>Biểu đồ thể hiện chi tiết danh sách đề tài thông qua bộ môn và niên khóa</i></span>
        </div>
    )
}
