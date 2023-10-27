import "./ViewCategory.css";
import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const ViewCategory = (params) => {
  const { http } = AuthUser();
  const location = useLocation();
  const { state } = location;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [category, setCategoryr] = useState();
  const [news, setNews] = useState([]);

  const newsColumns = [
    {
      field: "ids",
      headerName: "ID",
    },
    {
      field: "author",
      headerName: "Author",
      flex: 0.5,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0.5,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.5,
    },
    {
      field: "created_at",
      headerName: "Created day",
      flex: 0.5,
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

  useEffect(() => {
    const fetchData = async () => {
      const id = state?.id;
      await http
        .get(`/admin/news_list_by_category/${id}/`)
        .then((resolve) => {
          console.log("data ", resolve);
          const news_id = resolve.data.news.map((item, index) => ({
            ids: index + 1,
            ...item,
          }));
          setNews(news_id);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("111 ", state);
  return (
    <div>
      <div>
        <Header title="CATEGORY DETAIL" subtitle="Category Detail" />
        <div className="account-info">
          <div className="info-container">
            <div className="title-text">Category Name</div>
            <div className="content-text">{state?.name}</div>
          </div>
          <div className="info-container">
            <div className="title-text">Number of news</div>
            <div className="content-text">{state?.news_count}</div>
          </div>
        </div>
        <div className="news-comment">
          <div className="new">
            <div>
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
                <DataGrid rows={news} columns={newsColumns} />
              </Box>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;
