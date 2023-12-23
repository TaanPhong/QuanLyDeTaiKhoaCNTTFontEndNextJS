"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { UilFileEditAlt, UilTrashAlt } from '@iconscout/react-unicons'
import axios from 'axios';
import styles from '@/style/tableHome.module.css'
import { toast } from 'react-toastify';
import { Context } from '@/context/Context';
import HashLoader from "react-spinners/HashLoader";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}


function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [

    {
        id: 'stt',
        numeric: true,
        disablePadding: false,
        label: 'STT',
    },
    {
        id: 'studentCode',
        numeric: false,
        disablePadding: false,
        label: 'Mã sinh viên',
    },
    {
        id: 'fullName',
        numeric: false,
        disablePadding: false,
        label: 'Họ và tên',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'numberPhone',
        numeric: false,
        disablePadding: false,
        label: 'Số điện thoại',
    },
    {
        id: 'classCode',
        numeric: false,
        disablePadding: false,
        label: 'Lớp',
    },
];

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            <strong>{headCell.label}</strong>
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function TableStudent(props) {
    const { change, setChange, classCode, setStudent, setShow, setUpdate, search, isLoading, setIsLoading } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([])
    const context = React.useContext(Context);

    console.log("class code bảng sinh viên: ", classCode)
    React.useEffect(() => {
        axios.get("http://localhost:8081/student/" + classCode)
            .then(res => {
                const dataStudent = res.data.map((item, index) => {
                    return {
                        stt: index + 1,
                        ...item,
                    }
                })
                setIsLoading(false)
                setRows(dataStudent)
                setPage(0)
            })
            .catch(err => {
                toast.error("Hệ thống xảy ra lỗi!")
                console.log("Lỗi lấy sinh viên của một lớp", err)
            })
    }, [change, classCode])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = React.useMemo(
        () => {
            if (search) {
                return stableSort(rows, getComparator(order, orderBy)).filter(
                    item => item.fullName.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1)
                    .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                    )
            }
            else {
                return stableSort(rows, getComparator(order, orderBy)).slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage,
                )
            }
        },
        [order, orderBy, page, rowsPerPage, rows, search],
    );

    const handleDelete = (row) => {
        if (row.researchId) {
            toast.warning("Sinh viên đã được giao đề tài không thể xóa.")
        }
        else {
            if (window.confirm("Bạn thật sự muốn xóa sinh viên này?")) {
                axios.delete("http://localhost:8081/student/" + row.studentCode)
                    .then(res => {
                        toast.success("Xóa sinh viên thành công.")
                        setChange(!change)
                    })
                    .catch(err => {
                        console.log("Lỗi xóa sinh viên", err)
                        toast.error("Hệ thống xảy ra lỗi")
                    })
            }
        }

    }

    if (isLoading) {
        return (
            <div style={{
                width: "100%",
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <HashLoader color="#36d7b7" />
            </div>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                // const isItemSelected = isSelected(row.researchID);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align='center'
                                        >
                                            {row.stt}
                                        </TableCell>
                                        <TableCell align="left">{row.studentCode}</TableCell>
                                        <TableCell align="left" sx={{ width: '250px' }}>{row.fullName}</TableCell>
                                        <TableCell align="left">{row.email}</TableCell>
                                        <TableCell align="center">{row.numberPhone}</TableCell>
                                        <TableCell align="left" sx={{ width: '200px' }}>{row.classCode}</TableCell>
                                        <TableCell align="right" sx={{ width: '150px' }}>
                                            <div className={styles.action}>
                                                <UilFileEditAlt className={styles.icon} onClick={() => {
                                                    setStudent(row)
                                                    setShow(true);
                                                    setUpdate(true);
                                                }} />
                                                <UilTrashAlt className={styles.icon} onClick={() => { handleDelete(row) }} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}