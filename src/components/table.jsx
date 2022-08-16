import { useRef, useLayoutEffect, useState, useCallback } from "react";
import {
  Paper,
  TableBody,
  styled,
  Table,
  CircularProgress,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  tableCellClasses,
} from "@mui/material";
import "./components.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function InfiniteScrollTable({ rows, handleTableAction, loading, updateCurrentPage }) {
  const tableEl = useRef();
  const [distanceBottom, setDistanceBottom] = useState(0);

  const scrollListener = useCallback(() => {
    let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round((bottom / 100) * 20));
    }
    if (tableEl.current.scrollTop > bottom - distanceBottom && !loading) {
    //   fetchItems();
    updateCurrentPage()
    }
  }, [distanceBottom, loading, updateCurrentPage]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef.addEventListener("scroll", scrollListener);
    return () => {
      tableRef.removeEventListener("scroll", scrollListener);
    };
  }, [scrollListener]);

  return (
    <TableContainer component={Paper} ref={tableEl} className="table-container">
      <Table sx={{ minWidth: 700 }} aria-label="customized table" stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell sx = {{ width: 250 }}>Title</StyledTableCell>
            <StyledTableCell sx = {{ width: 300 }}>URL</StyledTableCell>
            <StyledTableCell>Created At</StyledTableCell>
            <StyledTableCell>Author</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            const { title, url, created_at, author } = row;
            return (
              <StyledTableRow key={i} className='dataRow' onClick={() => handleTableAction(row)}>
                <StyledTableCell component="th" scope="row"  sx = {{ width: 250 }}>
                  {title}
                </StyledTableCell>
                <StyledTableCell  sx = {{ width: 300 }} >{url}</StyledTableCell>
                <StyledTableCell >{(new Date(created_at)).toDateString()?.slice(-12)}</StyledTableCell>
                <StyledTableCell >{author}</StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
      {loading && <CircularProgress />}
    </TableContainer>
  );
}