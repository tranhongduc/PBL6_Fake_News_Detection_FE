import React, { useState, useEffect } from "react";
import styles from "./Category.module.scss";
import classNames from "classnames/bind";
import { category } from "../../assets/data/data";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
import AuthUser from "../../utils/AuthUser";

const cx = classNames.bind(styles);

const SampleNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={cx("control-btn")} onClick={onClick}>
      <button className={cx("next")}>
        <MdNavigateNext className={cx("icon")} />
      </button>
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className={cx("control-btn")} onClick={onClick}>
      <button className={cx("prev")}>
        <GrFormPrevious className={cx("icon")} />
      </button>
    </div>
  );
};

const Category = () => {
  const { http } = AuthUser();
  const [categorya, setCategorya] = useState([]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const handleClick = async (params) => {
    console.log(params);
  };

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/api/admin/categories_list/`)
        .then((resolve) => {
          const fetchedCategories = resolve.data.categories;

          fetchedCategories.sort((a, b) => a.name.localeCompare(b.name));
          setCategorya(resolve.data.categories);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("Category:", category);

  return (
    <section className={cx("category")}>
      <div className={cx("content")}>
        <Slider {...settings}>
          {category.map((item) => (
            <div
              className={cx("boxs")}
              key={item.id}
              onClick={() => handleClick({ item })}
            >
              <div className={cx("box")}>
                <img src={item.cover} alt="cover" />
                <div className={cx("overlay")}>
                  <h4>{item.category}</h4>
                  <p>{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Category;
