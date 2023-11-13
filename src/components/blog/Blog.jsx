import React, { useEffect, useState } from "react"
import styles from './Blog.module.scss'
import classNames from "classnames/bind";
import { blog } from "../../assets/data/data"
import { newsImg } from "../../assets/images/ca8.png"
import { AiOutlineTags, AiOutlineClockCircle, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { Link } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component";
import AuthUser from "../../utils/AuthUser";

const cx = classNames.bind(styles);



const Blog = () => {
  const { http, user } = AuthUser();

  // Fetch list news state
  const [listNews, setListNews] = useState([]);

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    const fetchData = () => {
      http.get('admin/news_list')
        .then((resolve) => {
          console.log(resolve.data)
          setListNews(resolve.data.news)
        })
        .catch((reject) => {
          console.log(reject)
        })
    }

    fetchData()
  }, [])

  return (
    <section className={cx("blog")}>
      <div className={cx("blog__container")}>
        {listNews.map((news) => (
          <div className={cx("boxItems")} key={news.id}>
            <div className={cx("img")}>
              <LazyLoadImage
                key={news.id}
                src={"https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D"}
                alt={`Blog ${news.id}`}
                effect="blur"
              />
            </div>
            <div className={cx("details")}>
              <div className={cx("tag")}>
                <AiOutlineTags className={cx("icon")} />
                <a href='/'>{news.category}</a>
              </div>
              <Link to={`/details/${news.id}`} className={cx("link")}>
                <h3>{news.title}</h3>
              </Link>
              <p>{news.title.slice(0, 180)}...</p>
              <div className={cx("date")}>
                {/* <AiOutlineClockCircle className={cx("icon")} /> <label htmlFor='date'>{item.date}</label> */}
                <AiOutlineComment className={cx("icon")} /> <label htmlFor='comment'>27</label>
                <AiOutlineShareAlt className={cx("icon")} /> <label htmlFor='share'>SHARE</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Blog
