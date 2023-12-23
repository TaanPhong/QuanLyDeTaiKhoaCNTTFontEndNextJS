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
import Checkbox from '@mui/material/Checkbox';
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
        id: 'schoolYearName',
        numeric: false,
        disablePadding: false,
        label: 'Tên khóa',
    },
    {
        id: 'academicYear',
        numeric: true,
        disablePadding: false,
        label: 'Năm nhập học',
    },
    {
        id: 'dateStart',
        numeric: false,
        disablePadding: false,
        label: 'Ngày bắt đầu',
    },
    {
        id: 'dateEnd',
        numeric: false,
        disablePadding: false,
        label: 'Ngày kết thúc',
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

export default function TableSchoolYear(props) {
    const { change, setChange, setSchoolYear, setShow, setUpdate, search, isLoading, setIsLoading } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const context = React.useContext(Context);

    React.useEffect(() => {
        axios.get('http://localhost:8081/SchoolYears')
            .then(res => {
                let getRow = res.data.map((item, index) => {
                    return {
                        stt: index + 1,
                        ...item,
                    }
                })
                setIsLoading(false)
                setRows(getRow);
                context.setListSchoolYear(getRow);
            })
            .catch(err => {
                console.log("loi")
                toast.error("Hệ thống xảy ra lỗi")
            })
    }, [change])

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
                    item => item.schoolYearName.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1)
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
        if (!row.lengthResearch) {
            if (window.confirm("Bạn thật sự muốn xóa niên khóa này?")) {
                axios.delete("http://localhost:8081/SchoolYear/" + row.id)
                    .then(res => {
                        toast.success("Xóa niên khóa thành công.")
                        setChange(!change)
                    })
                    .catch(err => {
                        console.log("Lỗi xóa niên khóa", err)
                        toast.error("Hệ thống xảy ra lỗi")
                    })
            }
        }
        else {
            toast.warning("Niên khóa đã tồn tại đề tài không thể xóa.")
        }
    }

    const handleUpdate = (row) => {
        let dateNow = new Date();
        let dateEnd = new Date(row.dateEnd)
        if (dateEnd.getTime() < dateNow.getTime()) {
            toast.info("Niên khóa đã kết thúc không thể chỉnh sửa.")
        }
        else {
            setSchoolYear(row)
            setShow(true);
            setUpdate(true);
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
                                        <TableCell align="left">{row.schoolYearName}</TableCell>
                                        <TableCell align="center">{row.academicYear}</TableCell>
                                        <TableCell align="center">{row.dateStart ? row.dateStart : "-"}</TableCell>
                                        <TableCell align="center">{row.dateEnd ? row.dateEnd : "-"}</TableCell>
                                        <TableCell align="right" sx={{ width: '150px' }}>
                                            <div className={styles.action}>
                                                <UilFileEditAlt className={styles.icon} onClick={() => {
                                                    handleUpdate(row)
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