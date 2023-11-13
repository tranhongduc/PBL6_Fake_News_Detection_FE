import React from "react"
import styles from './Home.module.scss'
import classNames from "classnames/bind";
import Category from '../../components/category/Category';
import Blog from "../../components/blog/Blog";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const cx = classNames.bind(styles);

const Home = () => {
  return (
    <div className={cx("home")}>
      <Header />
      <Category />
      <Blog />
      <Footer />
    </div>
  )
}

export default Home
