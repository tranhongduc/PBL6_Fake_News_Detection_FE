import "./News.css";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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
          "& .MuiDataGrid-root": { fontSize: "1rem" },
        }}
      >
        <DataGrid
          rows={news}
          columns={columns}
          onCellClick={handleDoubleClickCell}
        />
      </Box>
    </Box>
  );
};

export default News;
