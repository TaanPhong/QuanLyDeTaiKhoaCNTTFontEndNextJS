
import {
    IoDocumentTextOutline, IoFolderOpenOutline, IoPeopleOutline,
    IoBookOutline, IoPersonOutline, IoCheckmarkDoneCircleOutline, IoFileTrayFullOutline,
    IoBarChartOutline,
} from "react-icons/io5";

export const SidebarData = [
    {
        icon: IoDocumentTextOutline,
        heading: "Đề tài",
        link: "/FacultySecretary"
    },
    {
        icon: IoPersonOutline,
        heading: "Giảng viên",
        link: "/FacultySecretary/Lecture"
    },
    {
        icon: IoFolderOpenOutline,
        heading: "Niên khóa",
        link: "/FacultySecretary/SchoolYear"
    },
    {
        icon: IoBookOutline,
        heading: "Lớp",
        link: "/FacultySecretary/Class"
    },
    {
        icon: IoPeopleOutline,
        heading: "Sinh viên",
        link: "/FacultySecretary/Student"
    },
    {
        icon: IoCheckmarkDoneCircleOutline,
        heading: "Giao đề tài",
        link: "/FacultySecretary/Assignment"
    },
    {
        icon: IoFileTrayFullOutline,
        heading: "Báo cáo",
        link: "/FacultySecretary/UploadFile"
    }
];

export const SidebarDataDepartment = [
    {
        icon: IoDocumentTextOutline,
        heading: "Đề tài",
        link: "/DepartmentHead"
    },
    {
        icon: IoCheckmarkDoneCircleOutline,
        heading: "Duyệt đề tài",
        link: "/DepartmentHead/Revise"
    },
]

export const SidebarDataChair = [
    {
        icon: IoDocumentTextOutline,
        heading: "Đề tài",
        link: "/Chair"
    },
    {
        icon: IoCheckmarkDoneCircleOutline,
        heading: "Duyệt đề tài",
        link: "/Chair/Revise"
    },
    {
        icon: IoBarChartOutline,
        heading: "Thống kê",
        link: "/Chair/Statistical"
    },
]

export const SidebarDataLecture = [
    {
        icon: IoDocumentTextOutline,
        heading: "Đề tài",
        link: "/Lecture"
    },
]