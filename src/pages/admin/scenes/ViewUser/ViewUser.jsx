import "./ViewUser.css";
import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import { Divider } from "antd";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";
import Comment from "../../../../components/comment/Comment";
import { format, parseISO } from "date-fns";

const ViewUser = (params) => {
  const { http, setAuthorizationHeader, accessToken } = AuthUser();
  const location = useLocation();
  const { state } = location;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [viewUser, setViewUser] = useState();
  const [comments, setComments] = useState([]);
  const [news, setNews] = useState([]);
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
  const commentsColumns = [
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
  ];

  useEffect(() => {
    if (accessToken != null) {
      setAuthorizationHeader(accessToken);
    }

    const fetchData = () => {
      const id = state?.account_id;
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
        .get(`/admin/coments_list_by_user/${id}/`)
        .then((resolve) => {
          console.log("Comments:", resolve);
          const Comment_with_id = resolve.data.comments.map((item, index) => ({
            ids: index + 1,
            ...item,
          }));
          setComments(Comment_with_id);
        })
        .catch((error) => {
          console.log(error);
        });
      http
        .get(`/admin/news_list_by_author/${id}/`)
        .then((resolve) => {
          console.log("news:", resolve);
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
                <DataGrid rows={news} columns={newsColumns} />
              </Box>{" "}
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
          </div>
          {/* <Divider type="vertical" className="divide" />

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
                  "& .MuiDataGrid-root": { fontSize: "1.5rem" },
                }}
              >
                <DataGrid rows={comments} columns={commentsColumns} />
              </Box>{" "}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
