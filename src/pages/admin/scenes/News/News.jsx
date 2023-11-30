import "./News.css";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Pagination, Select, MenuItem } from "@mui/material";
import { tokens } from "../../theme";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const News = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const theme = useTheme();
  const [news, setNews] = useState([]);
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "author",
      headerName: "Author",
      flex: 0.5,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.5,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Created day",
      flex: 1,
      valueGetter: (params) => {
        const createdDate = new Date(params.row.created_at);
        const day = createdDate.getDate();
        const month = createdDate.getMonth();
        const year = createdDate.getFullYear();
        const time = day + "-" + month + "-" + year;
        return time;
      },
    },
    {
      field: "label",
      headerName: "Label",
      flex: 1,
      renderCell: ({ row: { label } }) => {
        if (label === "real") return <CheckIcon />;
        else return <ClearIcon />;
      },
    },
  ];

  const handleDoubleClickCell = async (params) => {
    const { row } = params;
    console.log(row);
    navigate("/admin/view_news", { state: row });
  };

  // CUSTOM datagrid

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset về trang đầu tiên khi thay đổi kích thước trang
  };

  const CustomPagination = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Pagination
        count={Math.ceil(news.length / pageSize)}
        page={page}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
        boundaryCount={2}
        siblingCount={2}
        style={{ marginRight: "20px" }}
      />
      <Select
        value={pageSize}
        onChange={(e) => handlePageSizeChange(e.target.value)}
        style={{ marginRight: "20px" }}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </Select>
    </div>
  );

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedRows = news.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/admin/news_list/`)
        .then((resolve) => {
          console.log(resolve);
          setNews(resolve.data.news);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box m="20px">
      <Header title="NEWS" subtitle="Managing news" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-root": { fontSize: "1.5rem" },
        }}
      >
        <DataGrid
          rows={displayedRows}
          columns={columns}
          pagination
          disableRowSelectionOnClick={true}
          pageSize={pageSize}
          rowCount={news.length}
          paginationMode="client"
          page={page}
          onPageChange={handlePageChange}
          onRowDoubleClick={handleDoubleClickCell}
          onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
          slots={{
            pagination: CustomPagination,
          }}
        />
      </Box>
    </Box>
  );
};

export default News;
