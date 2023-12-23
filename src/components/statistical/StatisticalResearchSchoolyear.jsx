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

export default function StatisticalResearchSchoolYear() {
    const [schoolYearResearch, setSchoolYearResearch] = useState([]);
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: "Thống kê danh sách đề tài theo niên khóa",
                data: [],
                backgroundColor: ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00", "#000000"],
                fill: true
            },
        ],
    })
    useEffect(() => {
        axios.get("http://localhost:8081/statistical/schoolyear/research")
            .then(res => {
                setSchoolYearResearch(res.data)
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi.")
                console.log("Lỗi lấy thống kê năm đề tài", err)
            })
    }, [])

    useEffect(() => {
        const dataColor = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00", "#000000",]
        const dataLabels = [];
        for (let index = 0; index < schoolYearResearch.length; index++) {
            const element = schoolYearResearch[index];
            if (dataLabels.length === 0 || !dataLabels.find(item => item === element.academicYear)) {
                let dataLabelsItem = element.academicYear;
                dataLabels.push(dataLabelsItem);
            }

        }
        const dataSubjects = []
        for (let index = 0; index < schoolYearResearch.length; index++) {
            const element = schoolYearResearch[index];
            if (dataSubjects.length === 0 || !dataSubjects.find(item => item === element.subjectCode)) {
                let dataSubjectsItem = element.subjectCode;
                dataSubjects.push(dataSubjectsItem);
            }

        }
        const datasets = [];
        for (let index = 0; index < dataSubjects.length; index++) {
            const element = dataSubjects[index];
            const val = schoolYearResearch.filter(item => item.subjectCode === element);
            const datasetItem = val.map(item => item.numberResearch)
            const value = {
                label: element,
                data: datasetItem,
                backgroundColor: dataColor[index],
                fill: true
            }
            datasets.push(value);
        }
        setData({
            labels: dataLabels,
            datasets: datasets,
        })
    }, [schoolYearResearch])

    const options = {
        plugin: {
            legend: true
        }
    }

    return (
        <div style={{
            height: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Chart type='bar' data={data} options={options} />
            <span style={{
                fontSize: "20px",
                marginTop: "20px",
                fontWeight: "600",
            }}> <i>Biểu đồ tổng quát thể hiện danh sách đề tài qua các năm</i></span>
        </div>
    )
}
