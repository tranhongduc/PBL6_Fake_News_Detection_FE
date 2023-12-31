import "./ViewAmin.css";
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

const ViewAmin = (params) => {
  const { http } = AuthUser();
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
      const id = state?.account_id;
      await http
        .get(`/admin/detail-user/${id}/`)
        .then((resolve) => {
          console.log("user", resolve);

          setViewUser(resolve.data);
        })
        .catch((error) => {
          console.log(error);
        });
      // await http
      //   .get(`/admin/coments_list_by_user/${id}/`)
      //   .then((resolve) => {
      //     console.log("comment >>>", resolve);
      //     const Comment_with_id = resolve.data.news.map((item, index) => ({
      //       ids: index + 1,
      //       ...item,
      //     }));
      //     setComments(Comment_with_id);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      // await http
      //   .get(`/admin/news_list_by_author/${id}/`)
      //   .then((resolve) => {
      //     const News_with_id = resolve.data.news.map((item, index) => ({
      //       ids: index + 1,
      //       ...item,
      //     }));
      //     setNews(News_with_id);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        <Header title="ADMIN INFO" subtitle="Admin infomation" />
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
      </div>
    </div>
  );
};

export default ViewAmin;
