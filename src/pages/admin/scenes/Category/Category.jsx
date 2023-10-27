import "./Category.css";
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
import axiosClient from "../../../../axios";
import AuthUser from "../../../../utils/AuthUser";

const Category = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  const theme = useTheme();
  // const [data, setData] = useState([]);
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
        {console.log("1")}
        <DataGrid
          rows={category}
          columns={columns}
          onCellClick={handleDoubleClickCell}
        />
      </Box>
    </Box>
  );
};

export default Category;
