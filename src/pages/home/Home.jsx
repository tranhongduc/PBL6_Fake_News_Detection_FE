import React from "react";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import { useParams } from "react-router-dom";
import Category from "../../components/category/Category";
import Blog from "../../components/blog/Blog";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const cx = classNames.bind(styles);

const Home = () => {
  const { id } = useParams();

  return (
    <div className={cx("aa")}>
      <div className={cx("home")}>
        <Header />
        <Category />
        {id !== undefined ? <p>ID: {id}</p> : <Blog />}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
