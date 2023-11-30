import "./User.css";
import { Box, useTheme, Pagination, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const User = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const theme = useTheme();
  const [user, setUser] = useState([]);
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "email",
      flex: 1.5,
      headerName: "Email",
    },
    {
      field: "news_count",
      headerName: "News",
      flex: 0.5,
    },
    {
      field: "comments_count",
      headerName: "Comments",
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        if (status === "active") return <CheckIcon />;
        else return <ClearIcon />;
      },
    },
  ];

  const handleDoubleClickCell = async (params) => {
    const { row } = params;
    console.log("go to user info", row);

    // Chuyển hướng đến trang hóa đơn
    navigate("/admin/view_user", { state: row });
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
        count={Math.ceil(user.length / pageSize)}
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
  const displayedRows = user.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/admin/list-user/`)
        .then((resolve) => {
          const dataWithIds = resolve.data.users.map((item, index) => ({
            id: index + 1,
            ...item,
          }));
          setUser(dataWithIds);
          console.log("user  list :", resolve);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="USER" subtitle="Managing User" />
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
          rowCount={user.length}
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

export default User;
