import React, { useEffect, useState } from "react"
import styles from './Blog.module.scss'
import classNames from "classnames/bind";
import { AiOutlineTags, AiOutlineComment, AiOutlineShareAlt, AiOutlineClockCircle } from "react-icons/ai"
import { Link } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component";
import AuthUser from "../../utils/AuthUser";
import { Pagination } from "antd";
import { storage } from '../../utils/firebase'
import { ref, getDownloadURL } from "firebase/storage"
import { format } from 'date-fns';

const cx = classNames.bind(styles);

const Blog = () => {
  const { http } = AuthUser();

  // Fetch image state
  const [imageUrl, setImageUrl] = useState({});

  const getFirebaseImageURL = async (imagePath, newsId) => {
    const imageRef = ref(storage, imagePath);
    try {
      const url = await getDownloadURL(imageRef);
      console.log('Url:', url)
      setImageUrl(prevState => ({
        ...prevState,
        [newsId]: url
      }));
      console.log('Image Url:', imageUrl)
    } catch (error) {
      console.error('Error getting image URL', error);
    }
  };

  // Pagination state
  const pageSizeOptions = [9, 12, 15];
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 12;
  const [listNews, setListNews] = useState([]); // Fetch list news state
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [totalNews, setTotalNews] = useState(0);

  // --------------------------     Paginate     --------------------------

  const handleClickPaginate = (page, pageSize) => {
    console.log(page, pageSize);
    setCurrentPage(page);
  }

  const handleShowSizeChange = (currentPage, pageSize) => {
    console.log(currentPage, pageSize);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    const fetchData = () => {
      http.get(`user/list_news_user/${pageSize}/${currentPage}`)
        .then((resolve) => {
          console.log('List news:', resolve.data)
          const listNews = resolve.data.news

          const newListNews = listNews.map((news) => ({
            ...news,
            imageUrl: '',
          }));
          console.log('New list news:', newListNews)
          setListNews(newListNews);

          setTotalNews(resolve.data.news_count)

          // Lấy URL cho từng tin tức
          newListNews.forEach((news) => {
            getFirebaseImageURL(news.image, news.id);
          });
        })
        .catch((reject) => {
          console.log('Error:', reject);
        });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  useEffect(() => {
    const updatedListNews = listNews.map((news) => ({
      ...news,
      imageUrl: imageUrl[news.id] || '',
    }));
    setListNews(updatedListNews);
  }, [imageUrl]);

  return (
    <div className={cx("blog-container")}>
      <div className={cx("blog-container__top")}>
        <div className={cx("top-left")}>
          {listNews.map((news) => (
            <div className={cx("boxItems")} key={news.id}>
              <div className={cx("img")}>
                <Link 
                  to={`/details/${news.id}`}
                  state={{
                    isEditAllowed: false,
                  }}
                >
                  <LazyLoadImage
                    key={news.id}
                    src={imageUrl[news.id] || ''}
                    alt={`Blog ${news.id}`}
                    effect="blur"
                  />
                </Link>
              </div>
              <div className={cx("details")}>
                <div className={cx("tag")}>
                  <AiOutlineTags className={cx("icon")} />
                  <Link to={'/'}>
                    {news.category}
                  </Link>
                </div>
                <Link 
                  to={`/details/${news.id}`}
                  state={{
                    isEditAllowed: false,
                  }}
                  className={cx("link")}
                >
                  <h3>{news.title}</h3>
                </Link>
                <p>{news.text.slice(0, 180)}...</p>
                <div className={cx("date")}>
                  <AiOutlineClockCircle className={cx("icon")} /> <label htmlFor='date'>{format(new Date(news.created_at), 'dd/MM/yyyy')}</label>
                  <AiOutlineComment className={cx("icon")} /> <label htmlFor='comment'>{news.comments_count}</label>
                  <AiOutlineShareAlt className={cx("icon")} /> <label htmlFor='share'>SHARE</label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="top-right">

        </div>
      </div>
      <div className={cx("blog-container__bottom")}>
        <Pagination
          current={currentPage}
          defaultCurrent={DEFAULT_CURRENT_PAGE_NUMBER}
          defaultPageSize={DEFAULT_PAGE_SIZE_NUMBER}
          hideOnSinglePage
          total={totalNews}
          pageSizeOptions={pageSizeOptions}
          showQuickJumper
          showSizeChanger
          onChange={handleClickPaginate}
          onShowSizeChange={handleShowSizeChange}
        />
      </div>
    </div>
  )
}

export default Blog
