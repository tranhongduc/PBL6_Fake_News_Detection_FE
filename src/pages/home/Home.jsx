import React from "react"
import styles from './Home.module.scss'
import classNames from "classnames/bind";
import Category from '../../components/category/Category';
import Blog from "../../components/blog/Blog";
import Header from "../../components/header/Header";

const cx = classNames.bind(styles);

const Home = () => {
  return (
    <div className={cx("home")}>
      <Header />
      <Category />
      <Blog />
    </div>
  )
}

export default Home
