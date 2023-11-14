import React, { useEffect, useState } from "react"
import styles from './Blog.module.scss'
import classNames from "classnames/bind";
import { AiOutlineTags, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { Link } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component";
import AuthUser from "../../utils/AuthUser";
import { Pagination } from "antd";
import { storage } from '../../utils/firebase'
import { ref, getDownloadURL, listAll } from "firebase/storage"

const cx = classNames.bind(styles);

const Blog = () => {
  const { http } = AuthUser();

  // Fetch categories state
  const [categories, setCategories] = useState([]);

  const getCategoryNameById = (categoryId) => {
    const category = categories.find(category => category.id === categoryId)
    return category.name
  }

  // Fetch image state
  const [imageUrl, setImageUrl] = useState({});

  const getFirebaseImageURL = async (imagePath, newsId) => {
    const imageRef = ref(storage, imagePath);
    try {
      const url = await getDownloadURL(imageRef);
      console.log('Url:', url)
      console.log('Image Url:', imageUrl)
      setImageUrl(prevState => ({
        ...prevState,
        [newsId]: url
      }));
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
      http.get('api/user/news/total')
        .then((resolve) => {
          console.log(resolve)
          setTotalNews(resolve.data.news_count)
        })
        .catch((reject) => {
          console.log(reject)
        })

      http.get('api/user/categories')
        .then((resolve) => {
          console.log(resolve)
          setCategories(resolve.data.categories)
        })
        .catch((reject) => {
          console.log(reject)
        })
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchData = () => {
      http.get(`api/user/paging?page_number=${currentPage}&page_size=${pageSize}`)
        .then((resolve) => {
          console.log(resolve.data)
          const newListNews = resolve.data.list_news.map((news) => ({
            ...news,
            imageUrl: '',
          }));
          setListNews(newListNews);
          
          // Lấy URL cho từng tin tức
          newListNews.forEach((news) => {
            getFirebaseImageURL(news.image, news.id);
          });
        })
        .catch((reject) => {
          console.log(reject);
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
    <section className={cx("blog")}>
      <div className={cx("blog__container")}>
        {listNews.map((news) => (
          <div className={cx("boxItems")} key={news.id}>
            <div className={cx("img")}>
              <LazyLoadImage
                key={news.id}
                src={imageUrl[news.id] || ''}
                alt={`Blog ${news.id}`}
                effect="blur"
              />
            </div>
            <div className={cx("details")}>
              <div className={cx("tag")}>
                <AiOutlineTags className={cx("icon")} />
                <a href='/'>{getCategoryNameById(news.category_id)}</a>
              </div>
              <Link to={`/details/${news.id}`} className={cx("link")}>
                <h3>{news.title}</h3>
              </Link>
              <p>{news.text.slice(0, 180)}...</p>
              <div className={cx("date")}>
                {/* <AiOutlineClockCircle className={cx("icon")} /> <label htmlFor='date'>{item.date}</label> */}
                <AiOutlineComment className={cx("icon")} /> <label htmlFor='comment'>27</label>
                <AiOutlineShareAlt className={cx("icon")} /> <label htmlFor='share'>SHARE</label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={cx("list-news-pagination")}>
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
    </section>
  )
}

export default Blog
