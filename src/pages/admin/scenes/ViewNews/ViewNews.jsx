import "./ViewNews.css";
import React, { useState, useEffect, useRef } from "react";
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
import { LazyLoadImage } from "react-lazy-load-image-component";
import Header from "../../components/Header";
import { useLocation } from "react-router-dom";
import AuthUser from "../../../../utils/AuthUser";
import { format, parseISO } from "date-fns";
import { storage } from "../../../../utils/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Comment from "../../components/comment/Comment";

const ViewNews = (params) => {
  const { http, setAuthorizationHeader, accessToken } = AuthUser();
  const location = useLocation();
  const { state } = location;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [viewUser, setViewUser] = useState();
  const [comments, setComments] = useState([]);
  const [pageComment, setPageComment] = React.useState(1);
  const [pageCommentSize, setPageCommentSize] = React.useState(5);
  const [pageCommentTotal, setPageCommentTotal] = React.useState();
  const [news, setNews] = useState([]);
  const [idNews, setIdNews] = useState();

  const [image, setImage] = useState("");
  const inputRef = useRef(null);

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
      .get(`/admin/comments_list_by_news/${idNews}/${page}`)
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
    </div>
  );

  const getFirebaseImageURL = async (imagePath) => {
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
    if (accessToken != null) {
      setAuthorizationHeader(accessToken);
    }
    const fetchData = async () => {
      const id = state?.id;
      setIdNews(id);
      try {
        const response = await http.get(`/admin/detail-news/${id}`);
        const newsDetail = response.data;
        setNews(newsDetail);

        // Update image URL
        const imageUrl = await getFirebaseImageURL(newsDetail.image);
        newsDetail.imageUrl = imageUrl;

        //comment new

        const responses = await http.get(
          `/admin/comments_list_by_news/${id}/${pageComment}`
        );
        const comments = responses.data.comments;
        setComments(comments);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box m="20px">
      <Header title="New INFO" subtitle="New detail infomation" />
      <div className="details-blog">
        <div className="details-blog__top">
          {image ? (
            <>
              <p>{image.name}</p>
              <img
                style={{ objectFit: "cover" }}
                src={URL.createObjectURL(image)}
                alt="blogImage"
                className="scaled-img"
              />
            </>
          ) : (
            <LazyLoadImage
              key={news.id}
              src={news.imageUrl}
              alt={`Blog ${news.id}`}
              effect="blur"
              width={"100%"}
              height={700}
              className="scaled-img"
            />
          )}
        </div>
        <div className="details-blog__bottom">
          <div className="details-blog-header">
            <h1 className="details-blog-header__top">{news.title}</h1>
            <div className="details-blog-header__bottom">
              <p>
                Author: <span className="author">{news.author}</span>
              </p>
              <p className="published_date">
                {news.created_at ? (
                  <p>
                    Published date:{" "}
                    {format(new Date(news.created_at), "dd/MM/yyyy")}
                  </p>
                ) : (
                  <></>
                )}
              </p>
            </div>
          </div>
          <p
            className="details-blog__content"
            dangerouslySetInnerHTML={{ __html: news.text }}
          ></p>
        </div>
      </div>

      <div className="news-comment">
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
    </Box>
  );
};

export default ViewNews;
