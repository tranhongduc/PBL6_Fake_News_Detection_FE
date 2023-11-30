import "./Manage.css";
import {
  Box,
  Typography,
  useTheme,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const Manage = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const theme = useTheme();
  const [adminList, setAdminList] = useState([]);
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "adminname",
      headerName: "User Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
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

  //CUSTOM DATAGRID

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
        count={Math.ceil(adminList.length / pageSize)}
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
  const displayedRows = adminList.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`admin/list-admin/`)
        .then((resolve) => {
          const dataWithIds = resolve.data.admins.map((item, index) => ({
            id: index + 1,
            ...item,
          }));
          setAdminList(dataWithIds);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDoubleClickCell = async (params) => {
    const { row } = params;
    console.log(row);
  };

  return (
    <Box m="20px">
      <Header title="ADMIN" subtitle="Managing the Admin Members" />
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
          rowCount={adminList.length}
          paginationMode="client"
          page={page}
          onPageChange={handlePageChange}
          onRowDoubleClick={handleDoubleClickCell}
          onPageSizeChange={(newPageSize) => handlePageSizeChange(newPageSize)}
          slots={{
            pagination: CustomPagination,
          }}
        />

        {/* <DataGrid
          rows={adminList}
          columns={columns}
          onCellClick={handleDoubleClickCell}
        /> */}
      </Box>
    </Box>
  );
};

export default Manage;
