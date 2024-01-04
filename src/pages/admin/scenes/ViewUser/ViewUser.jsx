import "./ViewUser.css";
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
import { Divider } from "antd";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";
import Comment from "../../components/comment/Comment";
import { format, parseISO } from "date-fns";

const ViewUser = (params) => {
  const { http, setAuthorizationHeader, accessToken } = AuthUser();
  const location = useLocation();
  const { state } = location;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [viewUser, setViewUser] = useState();
  const [news, setNews] = useState([]);
  const [pageNew, setPageNew] = React.useState(1);
  const [pageNewSize, setPageNewSize] = React.useState(20);
  const [pageNewTotal, setPageNewTotal] = React.useState();
  const [comments, setComments] = useState([]);
  const [pageComment, setPageComment] = React.useState(1);
  const [pageCommentSize, setPageCommentSize] = React.useState(5);
  const [pageCommentTotal, setPageCommentTotal] = React.useState();
  const [idAccount, setIdAccount] = useState();
  const newsColumns = [
    {
      field: "ids",
      headerName: "ID",
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.25,
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
    console.log("1111", row);
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
      .get(`/admin/news_list_by_author/${idAccount}/${pageSize}/${page}`)
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

  //comment
  const handlePageCommentChange = (event, newPage) => {
    fetchDataComment(newPage, pageCommentSize);
    setPageComment(newPage);
  };

  const handlePageCommentSizeChange = (newPageSize) => {
    setPageCommentSize(newPageSize);
    setPageComment(1);
    fetchDataComment(1, newPageSize);
  };
  const fetchDataComment = async (page, pageSize) => {
    await http
      .get(`/admin/coments_list_by_user/${idAccount}/${pageSize}/${page}`)
      .then((resolve) => {
        console.log("Comments:", resolve);
        const Comment_with_id = resolve.data.comments.map((item, index) => ({
          ids: index + 1,
          ...item,
        }));
        setPageCommentTotal(resolve.data.total_pages);
        setComments(Comment_with_id);
      })
      .catch((reject) => {
        console.log(reject);
      });
  };

  const CustomPaginationComment = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pagination
        count={pageCommentTotal}
        page={pageComment}
        onChange={handlePageCommentChange}
        showFirstButton
        showLastButton
        boundaryCount={2}
        siblingCount={2}
        style={{ marginRight: "20px" }}
      />
      <Select
        value={pageCommentSize}
        onChange={(e) => handlePageCommentSizeChange(e.target.value)}
        style={{ marginRight: "20px" }}
      >
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </Select>
    </div>
  );

  useEffect(() => {
    if (accessToken != null) {
      setAuthorizationHeader(accessToken);
    }
    const fetchData = () => {
      const id = state?.account_id;
      setIdAccount(id);
      http
        .get(`/admin/detail-user/${id}/`)
        .then((resolve) => {
          console.log(resolve);
          setViewUser(resolve.data);
        })
        .catch((error) => {
          console.log(error);
        });
      http
        .get(
          `/admin/coments_list_by_user/${id}/${pageCommentSize}/${pageComment}`
        )
        .then((resolve) => {
          console.log("Comments:", resolve);
          const Comment_with_id = resolve.data.comments.map((item, index) => ({
            ids: index + 1,
            ...item,
          }));
          setPageCommentTotal(resolve.data.total_pages);
          setComments(Comment_with_id);
        })
        .catch((error) => {
          console.log(error);
        });
      http
        .get(`/admin/news_list_by_author/${id}/${pageNewSize}/${pageNew}`)
        .then((resolve) => {
          console.log("news:", resolve);
          const News_with_id = resolve.data.news.map((item, index) => ({
            ids: index + 1 + (pageNew - 1) * pageNewSize,
            ...item,
          }));
          setPageNewTotal(resolve.data.total_pages);
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
    <Box m="20px">
      <div>
        <Header title="STAFF INFO" subtitle="Staff infomation" />
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
        <div className="news-comment">
          <div className="new">
            <div className="title-text">New</div>
            <div className="content-text">
              {viewUser?.news_count_fake + viewUser?.news_count_real}
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
          <Divider className="divide" />
          <div className="comment">
            <div className="title-text">Comment</div>
            <div className="content-text">{viewUser?.comments_count}</div>
            <div className="Text">
              <div className="Text__contain">
                {comments.map((comment) => (
                  <Comment
                    commentId={comment?.id}
                    avatar={comment?.avatar}
                    comment={comment?.text}
                    publishedDate={format(
                      parseISO(comment.created_at),
                      "MMM dd, yyyy"
                    )}
                    username={comment?.author}
                    email={""}
                    isEditAllowed={""}
                    toggleReportModal={""}
                  ></Comment>
                ))}
              </div>
            </div>
            <CustomPaginationComment />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ViewUser;
