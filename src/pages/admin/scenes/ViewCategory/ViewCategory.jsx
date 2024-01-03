import "./ViewCategory.css";
import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  useTheme,
  Button,
  MenuItem,
  Pagination,
  Select,
  List,
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const ViewCategory = (params) => {
  const { http } = AuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [category, setCategory] = useState();

  const [news, setNews] = useState([]);
  const [pageNew, setPageNew] = React.useState(1);
  const [pageNewSize, setPageNewSize] = React.useState(20);
  const [pageNewTotal, setPageNewTotal] = React.useState();

  const newsColumns = [
    {
      field: "ids",
      headerName: "ID",
    },
    {
      field: "author",
      headerName: "Author",
      flex: 0.25,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Created day",
      flex: 0.25,
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
      field: "comments_count",
      headerName: "Comment",
      flex: 0.2,
      align: "center",
    },
    {
      field: "label",
      headerName: "Label",
      renderCell: ({ row: { label } }) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {label === "real" ? (
              <CheckIcon
                style={{
                  color: colors.greenAccent[300],
                }}
              />
            ) : (
              <ClearIcon
                style={{
                  color: colors.redAccent[300],
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  const handleDoubleClickCell = async (params) => {
    const { row } = params;
    console.log(row);
    navigate("/admin/view_news", { state: row });
  };

  //news

  const handlePageChange = (event, newPage) => {
    fetchDataNew(newPage, pageNewSize);
    setPageNew(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageNewSize(newPageSize);
    setPageNew(1);
    fetchDataNew(1, newPageSize);
  };
  const fetchDataNew = async (page, pageSize) => {
    await http
      .get(`/admin/news_list_by_category/${category.id}/${pageSize}/${page}`)
      .then((resolve) => {
        console.log("news:", resolve);
        const News_with_id = resolve.data.news.map((item, index) => ({
          ids: index + 1 + (page - 1) * pageSize,
          ...item,
        }));
        setPageNewTotal(resolve.data.total_pages);
        setNews(News_with_id);
      })
      .catch((reject) => {
        console.log(reject);
      });
  };

  const CustomPagination = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Pagination
        count={pageNewTotal}
        page={pageNew}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
        boundaryCount={2}
        siblingCount={2}
        style={{ marginRight: "20px" }}
      />
      <Select
        value={pageNewSize}
        onChange={(e) => handlePageSizeChange(e.target.value)}
        style={{ marginRight: "20px" }}
      >
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      const id = state?.id;
      setCategory(state);
      await http
        .get(`/admin/news_list_by_category/${id}/${pageNewSize}/${pageNew}`)
        .then((resolve) => {
          console.log("data ", resolve);
          const news_id = resolve.data.news.map((item, index) => ({
            ids: index + 1,
            ...item,
          }));
          setPageNewTotal(resolve.data.total_pages);
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
    <Box m="20px">
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
          <div className="info-container">
            <div className="title-text">New</div>
            <div className="content-text">{state?.news_count}</div>
          </div>
          <div className="info-container">
            <div className="title-text">True New</div>
            <div className="content-text">{state?.news_count_real}</div>
          </div>
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
              <DataGrid
                rows={news}
                columns={newsColumns}
                pagination
                disableRowSelectionOnClick={true}
                pageSize={pageNewSize}
                rowCount={news.length}
                paginationMode="client"
                page={pageNew}
                onPageChange={handlePageChange}
                onRowDoubleClick={handleDoubleClickCell}
                onPageSizeChange={(newPageSize) =>
                  handlePageSizeChange(newPageSize)
                }
                slots={{
                  pagination: CustomPagination,
                }}
              />
            </Box>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ViewCategory;
