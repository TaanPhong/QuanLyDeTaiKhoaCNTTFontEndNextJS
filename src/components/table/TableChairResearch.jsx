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
import { UilFileEditAlt, UilFileTimesAlt } from '@iconscout/react-unicons'
import axios from 'axios';
import styles from '@/style/tableHome.module.css'
import { Context } from '@/context/Context';
import { toast } from 'react-toastify';
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
        id: 'fullNameLecture',
        numeric: false,
        disablePadding: false,
        label: 'Tên giảng viên',
    },
    {
        id: 'researchStatusName',
        numeric: false,
        disablePadding: false,
        label: 'Trạng thái',
    },
    {
        id: 'schoolYearName',
        numeric: false,
        disablePadding: false,
        label: 'Khóa',
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

export default function EnhancedTable(props) {
    const { selected, setSelected, change, setShowNote, setResearch, setShowModalsDetail,
        search, schoolYearId, setDeleted, isLoading, setIsLoading, status } = props;
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [displayCheckBox, setDisplayCheckbox] = React.useState(false);
    const context = React.useContext(Context)
    let deleted = false;
    let dateStart = new Date(context.schoolYearMax.dateStart)
    let dateEnd = new Date(context.schoolYearMax.dateEnd);
    let dateNow = new Date();
    let checkDate = dateStart.getTime() <= dateNow.getTime() && dateNow.getTime() <= dateEnd.getTime();

    React.useEffect(() => {
        const check = rows.find((item) => {
            return item.researchStatusName === "Đã được duyệt"
                && item.schoolYearName === context.schoolYearMax.schoolYearName && checkDate;
        })
        if (check) {
            setDisplayCheckbox(true);
        }
        else {
            setDisplayCheckbox(false);
        }
    }, [rows])

    React.useEffect(() => {
        setPage(0)
    }, [status])

    const displayCheckBoxInRow = (row, isItemSelected, labelId) => {
        if (row.researchStatusName === "Đã được duyệt" && row.schoolYearName === context.schoolYearMax.schoolYearName && checkDate) {
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

    React.useEffect(() => {
        if (schoolYearId == 0) {
            axios.get('http://localhost:8081/research/all')
                .then(res => {
                    let getRow = res.data.map((item, index) => {
                        return {
                            id: index + 1,
                            ...item,
                        }
                    })
                    setIsLoading(false)
                    setRows(getRow);
                })
                .catch(err => {
                    console.log("loi lấy tất cả đề tài :v ", err)
                    toast.error("Quá trình lấy danh sách đề tài xảy ra lỗi")
                })
        }
        else {
            axios.get("http://localhost:8081/research/chair/" + schoolYearId)
                .then(res => {
                    let getRow = res.data.map((item, index) => {
                        return {
                            id: index + 1,
                            ...item,
                        }
                    })
                    setIsLoading(false)
                    setRows(getRow);
                    setPage(0)
                })
                .catch(err => {
                    toast.error("Quá trình lấy dữ liệu theo niên khóa xảy ra lỗi")
                    console.log("Lỗi lấy dữ liệu niên khóa đề tài trưởng khoa", err)
                })
        }
    }, [change, schoolYearId])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = [];
            rows.forEach(item => {
                if (item.researchStatusName === 'Đã được duyệt'
                    && item.schoolYearName === context.schoolYearMax.schoolYearName && checkDate) {
                    newSelected.push(item.researchID);
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

    const visibleRows = React.useMemo(
        () => {
            if (search) {
                return stableSort(rows, getComparator(order, orderBy)).filter(
                    item => item.researchName.toLowerCase().indexOf(search.toLowerCase().trim()) !== -1)
                    .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                    )
            }
            else if (status) {
                return stableSort(rows, getComparator(order, orderBy)).filter(
                    item => item.researchStatusName === status)
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
        [order, orderBy, page, rowsPerPage, rows, search, status],
    );

    const handleClickUpdate = (row) => {
        if (row.researchStatusName === "Đã được duyệt"
            && row.schoolYearName === context.schoolYearMax.schoolYearName && checkDate) {
            if (deleted) {
                setResearch(row)
                setDeleted(true)
                setShowNote(true)
            }
            else {
                setResearch(row)
                setDeleted(false);
                setShowNote(true)
            }
        }
        else {
            toast.warning("Chỉ có thể thực hiện yêu cầu trên các đề tài có trạng thái là đã được duyệt hoặc đang trong thời gian thực hiện.")
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
                                        <TableCell align="left" sx={{ width: '200px' }}>{row.fullNameLecture}</TableCell>
                                        <TableCell align="left" sx={{ width: '180px' }}><span style={context.styleStatus(row)}>{row.researchStatusName}</span></TableCell>
                                        <TableCell align="left" sx={{ width: '150px' }}>{row.schoolYearName}</TableCell>
                                        <TableCell align="right" sx={{ width: '150px' }}>
                                            <div className={styles.action}>
                                                <span onClick={() => {
                                                    setShowModalsDetail(true);
                                                    setResearch(row);
                                                }}>Chi tiết</span>
                                                <UilFileEditAlt className={styles.icon} onClick={() => {
                                                    deleted = false
                                                    handleClickUpdate(row)
                                                }} />
                                                <UilFileTimesAlt className={styles.icon} onClick={() => {
                                                    deleted = true;
                                                    handleClickUpdate(row)
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