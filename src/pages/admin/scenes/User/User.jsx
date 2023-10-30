import "./User.css";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const User = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
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
      headerName: "Email",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
  ];

  const handleDoubleClickCell = async (params) => {
    const { row } = params;
    console.log("go to user info", row);

    // Chuyển hướng đến trang hóa đơn
    navigate("/admin/view_user", { state: row });
  };

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/auth/list-user/`)
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
          rows={user}
          columns={columns}
          onCellDoubleClick={handleDoubleClickCell}
        />
      </Box>
    </Box>
  );
};

export default User;
