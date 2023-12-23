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
import { UilFileEditAlt, UilPadlock } from '@iconscout/react-unicons'
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
        id: 'positionName',
        numeric: false,
        disablePadding: false,
        label: 'Chức vụ',
    },
    {
        id: 'subjectName',
        numeric: false,
        disablePadding: false,
        label: 'Bộ môn',
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

export default function TableLecture(props) {
    const { change, setChange, setLecture, setShow, setUpdate, subjectCode, search, isLoading, setIsLoading } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const context = React.useContext(Context);

    React.useEffect(() => {
        if (subjectCode == 0) {
            axios.get('http://localhost:8081/lectures')
                .then(res => {
                    let getRow = res.data.map((item, index) => {
                        return {
                            stt: index + 1,
                            ...item,
                        }
                    })
                    setIsLoading(false)
                    setRows(getRow);
                    //context.setLectures(getRow);
                })
                .catch(err => {
                    console.log("loi lấy all giảng viên", err)
                    toast.error("Hệ thống xảy ra lỗi")
                })
        }
        else {
            axios.get("http://localhost:8081/lectures/" + subjectCode)
                .then(res => {
                    let getRow = res.data.map((item, index) => {
                        return {
                            stt: index + 1,
                            ...item,
                        }
                    })
                    setIsLoading(false)
                    setRows(getRow);
                    setPage(0)
                    //context.setLectures(getRow);
                })
                .catch(err => {
                    console.log("loi lấy giảng viên theo bộ môn", err)
                    toast.error("Hệ thống xảy ra lỗi")
                })
        }
    }, [change, subjectCode])

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
                                        <TableCell align="left">{row.fullName}</TableCell>
                                        <TableCell align="left">{row.email}</TableCell>
                                        <TableCell align="left">{row.numberPhone}</TableCell>
                                        <TableCell align="left">{row.positionName}</TableCell>
                                        <TableCell align="left">{row.subjectName}</TableCell>
                                        <TableCell align="right" sx={{ width: '150px' }}>
                                            <div className={styles.action}>
                                                <UilFileEditAlt className={styles.icon} onClick={() => {
                                                    setLecture(row)
                                                    setShow(true);
                                                    setUpdate(true);
                                                }} />
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