import "./Category.css";
import { Box, useTheme, Pagination, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const Category = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const theme = useTheme();
  const [category, setCategory] = useState([]);
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "news_count",
      headerName: "News Count",
      flex: 1,
    },
  ];

  const handleDoubleClickCell = async (params) => {
    const { row } = params;
    console.log(row);
    navigate("/admin/view_category", { state: row });
  };

  //custom

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const CustomPagination = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Pagination
        count={Math.ceil(category.length / pageSize)}
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
  const displayedRows = category.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/admin/categories_list/`)
        .then((resolve) => {
          console.log(resolve);
          setCategory(resolve.data.categories);
          console.log(category);
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
      <Header title="CATOGORY" subtitle="Category News" />
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
          rowCount={category.length}
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

export default Category;
