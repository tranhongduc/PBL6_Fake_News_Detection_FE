import "./ViewNews.css";
import React, { useState, useEffect } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import { Divider } from "antd";
import { BsPencilSquare } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import { storage } from "../../../../utils/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { LazyLoadImage } from "react-lazy-load-image-component";
import AuthUser from "../../../../utils/AuthUser";
import Comments from "../../../../components/comments/Comment";

const ViewNews = (params) => {
  const { http } = AuthUser();
  const location = useLocation();
  const { state } = location;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [news, setNews] = useState({});
  const [comments, setComment] = useState([]);

  const getFirebaseImageURL = async (imagePath, newsId) => {
    const imageRef = ref(storage, imagePath);

    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error getting image URL", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = state?.id;
        const response = await http.get(`/admin/detail-news/${id}/`);
        const newsDetail = response.data;
        const imageUrl = await getFirebaseImageURL(newsDetail.image);
        newsDetail.imageUrl = imageUrl;
        setNews(newsDetail);

        const responseComment = await http.get(
          `/admin/comments_list_by_news/${id}/${1}`
        );
        setComment(responseComment.data.comments);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box m="20px">
      <Header title="NEWS INFO" subtitle="News infomation" />
      <div className="account-info">
        <div className="info-container">
          <div className="title-text">Author: </div>
          <div className="content-text">{news?.author}</div>
        </div>
        <div className="info-container">
          <div className="title-text">Created day: </div>
          <div className="content-text">{news?.created_at}</div>
        </div>
      </div>

      <div className="left">
        <LazyLoadImage
          key={news.id}
          src={news.imageUrl}
          alt={`Blog ${news.id}`}
          effect="blur"
          width={1800}
          height={700}
          className="scaled-img"
        />
      </div>
      <div className="right">
        <div className="buttons">
          <button className="button">
            <BsPencilSquare />
          </button>
          <button className="button">
            <AiOutlineDelete />
          </button>
        </div>
        <h1>{news.title}</h1>
        <p>{news.text}</p>
      </div>

      <h1>Comment</h1>

      <div className="Comment">
        <div className="Comment__contain">
          {comments.map((comment) => (
            <Comments
              username={comment?.account_id}
              comment={comment?.text}
            ></Comments>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default ViewNews;
