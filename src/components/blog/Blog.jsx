import React from "react"
import styles from './Blog.module.scss'
import classNames from "classnames/bind";
import { blog } from "../../assets/data/data"
import { AiOutlineTags, AiOutlineClockCircle, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai"
import { Link } from "react-router-dom"
import { LazyLoadImage } from "react-lazy-load-image-component";

const cx = classNames.bind(styles);

const Blog = () => {
  return (
    <section className={cx("blog")}>
      <div className={cx("blog__container")}>
        {blog.map((item) => (
          <div className={cx("boxItems")} key={item.id}>
            <div className={cx("img")}>
              <LazyLoadImage
                key={item.cover}
                src={item.cover}
                alt={`Blog ${item.id}`}
                effect="blur"
                placeholderSrc={item.cover}
              />
            </div>
            <div className={cx("details")}>
              <div className={cx("tag")}>
                <AiOutlineTags className={cx("icon")} />
                <a href='/'>{item.category}</a>
              </div>
              <Link to={`/details/${item.id}`} className={cx("link")}>
                <h3>{item.title}</h3> 
              </Link>
              <p>{item.desc.slice(0, 180)}...</p>
              <div className={cx("date")}>
                <AiOutlineClockCircle className={cx("icon")} /> <label htmlFor='date'>{item.date}</label>
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
