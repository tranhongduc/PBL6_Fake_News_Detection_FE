import "./ViewUser.css";
import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme, MenuItem, Pagination, Select } from "@mui/material";
import { Divider } from "antd";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";

const ViewUser = (params) => {
  const { http } = AuthUser();
  const location = useLocation();
  const { state } = location;
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [viewUser, setViewUser] = useState();
  const [comments, setComments] = useState([]);
  const [news, setNews] = useState([]);
  const columns = [
    {
      field: "ids",
      headerName: "ID",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      cellClassName: "name-column--cell",
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
      field: "Status",
      headerName: "Label",
      flex: 1,
      renderCell: ({ row: { label } }) => {
        if (label === "real") return <CheckIcon />;
        else return <ClearIcon />;
      },
    },
  ];
  const newsColumns = [
    {
      field: "ids",
      headerName: "ID",
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
      const id = state?.account_id;

      console.log("id ", id);
      await http
        .get(`/admin/detail-user/${id}/`)
        .then((resolve) => {
          setViewUser(resolve.data);
        })
        .catch((error) => {
          console.log(error);
        });
      await http
        .get(`/admin/coments_list_by_user/${id}/`)
        .then((resolve) => {
          console.log("comment >>>", resolve);
          const Comment_with_id = resolve.data.comments.map((item, index) => ({
            ids: index + 1,
            ...item,
          }));
          setComments(Comment_with_id);
        })
        .catch((error) => {
          console.log(error);
        });
      await http
        .get(`/admin/news_list_by_author/${id}/`)
        .then((resolve) => {
          const News_with_id = resolve.data.news.map((item, index) => ({
            ids: index + 1,
            ...item,
          }));
          setNews(News_with_id);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        <Header title="USER INFO" subtitle="User infomation" />
        <div className="account-info">
          <div className="info-container">
            <div className="title-text">Name</div>
            <div className="content-text">{viewUser?.username}</div>
          </div>
          <div className="info-container">
            <div className="title-text">Email</div>
            <div className="content-text">{viewUser?.email}</div>
          </div>
        </div>
        {/* <div className="news-comment">
          <div className="new">
            <div className="title-text">New</div>
            <div className="content-text">{viewUser?.news_count}</div>
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
          <Divider type="vertical" className="divide" />
          <div className="comment">
            <div className="title-text">Comment</div>
            <div className="content-text">{viewUser?.comments_count}</div>
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
                }}
              >
                <DataGrid rows={mockDataTeam} columns={columns} />
              </Box>{" "}
            </div>
          </div>
        </div> */}

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
  );
};

export default ViewUser;
