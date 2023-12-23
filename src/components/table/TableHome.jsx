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
import { UilFileEditAlt, UilTrashAlt, UilFileDownload } from '@iconscout/react-unicons'
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
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'STT',
    },
    {
        id: 'researchName',
        numeric: false,
        disablePadding: false,
        label: 'Tên đề tài',
    },
    {
        id: 'schoolYearName',
        numeric: false,
        disablePadding: false,
        label: 'Khóa',
    },
    {
        id: 'researchStatusName',
        numeric: false,
        disablePadding: false,
        label: 'Trạng thái',
    },
    {
        id: 'fullNameStudent',
        numeric: false,
        disablePadding: false,
        label: 'Sinh viên thực hiện',
    },
    {
        id: '',
        numeric: false,
        disablePadding: false,
        label: '',
    },
];


function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, displayCheckBox } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {
                    displayCheckBox ? <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected !== 0}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </TableCell> : <></>
                }
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

function TableHome(props) {
    const { setShowModals, setUpdate, setResearch, setChange, change, schoolYearId,
        setShowModalsDetail, selected, setSelected, search, isLoading, setIsLoading, status } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [displayCheckBox, setDisplayCheckbox] = React.useState(false);
    const [visibleRows, setVisibleRows] = React.useState([]);
    const [rows, setRows] = React.useState([]);
    const context = React.useContext(Context);
    let dateStart = new Date(context.schoolYearMax.dateStart)
    let dateEnd = new Date(context.schoolYearMax.dateEnd);
    let dateNow = new Date();
    let checkDate = dateStart.getTime() <= dateNow.getTime() && dateNow.getTime() <= dateEnd.getTime();

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            let newSelected = [];
            rows.forEach((row) => {
                if (row.researchStatusName === 'Khởi tạo' && row.schoolYearName === context.schoolYearMax.schoolYearName && checkDate) {
                    newSelected.push(row.researchID);
                }
            })
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };


    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    React.useEffect(() => {
        const check = rows.find((item) => {
            return item.researchStatusName === "Khởi tạo" && item.schoolYearName === context.schoolYearMax.schoolYearName && checkDate;
        })
        if (check) {
            setDisplayCheckbox(true);
        }
        else {
            setDisplayCheckbox(false);
        }
    }, [rows])

    React.useEffect(() => {
        if (schoolYearId == 0) {
            axios.get("http://localhost:8081/" + context.account?.username)
                .then((res) => {
                    setIsLoading(false);
                    let data = res.data.researchDTOs.map((item, index) => {
                        return {
                            id: index + 1,
                            ...item,
                        }
                    })
                    setIsLoading(false)
                    setRows(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            axios.get("http://localhost:8081/research/" + schoolYearId + "/" + context.account.idLecture)
                .then((res) => {
                    let data = res.data.map((item, index) => {
                        return {
                            id: index + 1,
                            ...item,
                        }
                    })
                    setIsLoading(false);
                    setRows(data)
                    setPage(0)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [change, schoolYearId])

    React.useEffect(() => {
        setPage(0);
    }, [status])

    React.useEffect(() => {
        if (search) {
            const data = stableSort(rows, getComparator(order, orderBy)).filter(
                item => item.researchName.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1)
                .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage,
                )
            setVisibleRows(data);
        }
        else if (status) {
            const data = stableSort(rows, getComparator(order, orderBy)).filter(
                item => item.researchStatusName === status)
                .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage,
                )
            setVisibleRows(data)
        }
        else {
            const data = stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            )
            setVisibleRows(data)
        }
    }, [order, orderBy, page, rowsPerPage, rows, search, status]);

    const handleDelete = (row) => {
        if (row.researchStatusName === 'Khởi tạo') {
            if (window.confirm("Bạn thật sự muốn xóa đề tài này?")) {
                axios.delete("http://localhost:8081/research/" + row.researchID)
                    .then((res) => {
                        setChange(!change)
                        toast.success("Xóa đề tài thành công")
                    })
                    .catch(err => {
                        console.log('Lỗi', err);
                        toast.warning("Quá trình xóa sảy ra lỗi!")
                    })
            }
        }
        else {
            toast.warning("Chỉ có thể xóa các đề tài có trạng thái là khởi tạo!")
        }
    }

    const handleUpdate = (row) => {
        if (row.researchStatusName === 'Khởi tạo' || row.researchStatusName === "Chỉnh sửa") {
            setResearch(row)
            setShowModals(true);
            setUpdate(true);
        }
        else {
            toast.warning("Chỉ có thể thực hiện chỉnh sửa các đề tài có trạng thái là khởi tạo hoặc chỉnh sửa!")
        }
    }

    // Tải file xuống 
    const handleDownloadFile = (row) => {
        axios.get("http://localhost:8081/uploadFileReport/" + row.reportDocumentCode, { responseType: "blob" })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', row.reportFile);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(err => {
                toast.error("Quá trình tải file xảy ra lỗi.")
            })
    }

    const displayCheckBoxInRow = (row, isItemSelected, labelId) => {
        if (row.researchStatusName === "Khởi tạo" && row.schoolYearName === context.schoolYearMax.schoolYearName && checkDate) {
            return (
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onClick={(event) => handleClick(event, row.researchID)}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                    />
                </TableCell>
            )
        }
        else {
            return displayCheckBox ? <TableCell></TableCell> : <></>
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
                            displayCheckBox={displayCheckBox}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.researchID);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        {
                                            displayCheckBoxInRow(row, isItemSelected, labelId)
                                        }
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align='center'
                                        >
                                            {row.id}
                                        </TableCell>
                                        <TableCell align="left">{row.researchName}</TableCell>
                                        <TableCell align="left" sx={{ width: '100px' }}>{row.schoolYearName}</TableCell>
                                        <TableCell align="left" sx={{ width: '180px' }}  ><span style={context.styleStatus(row)}>{row.researchStatusName}</span></TableCell>
                                        <TableCell align={row.fullNameStudent ? "left" : "center"}>{row.fullNameStudent ? row.fullNameStudent : "-"}</TableCell>
                                        <TableCell align="right" sx={{ width: '180px' }}>
                                            <div className={styles.action}>
                                                <span onClick={() => {
                                                    setResearch(row);
                                                    setShowModalsDetail(true);
                                                }}>Chi tiết</span>
                                                <UilFileEditAlt className={styles.icon} onClick={() => {
                                                    handleUpdate(row)
                                                }} />
                                                <UilTrashAlt className={styles.icon} onClick={() => { handleDelete(row) }} />
                                                {
                                                    row.reportDocumnetCode ?
                                                        <UilFileDownload className={styles.icon} onClick={() => { handleDownloadFile(row) }} /> : <></>
                                                }
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

export default TableHome;