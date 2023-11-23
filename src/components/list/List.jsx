import React, { useState, useEffect } from "react";
import styles from "./List.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { category } from "../../assets/data/data";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AuthUser from "../../utils/AuthUser";
import Header from "../header/Header";
import { Button, Popover } from "antd";

const cx = classNames.bind(styles);

const hoverContent = <div>This is hover content.</div>;

// const CategoryPopover = ({ categoryData }) => {
//   console.log(categoryData);
//   return <div></div>;
// };

const List = () => {
  const { http } = AuthUser();
  const [category, setCategory] = useState([]);
  const [list, setList] = useState([]);

  const [item, setItem] = useState();

  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

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
          const i = 0;
          const groupedCategories = fetchedCategories.reduce((acc, item) => {
            const firstChar = item.name.charAt(0).toUpperCase();
            if (!acc[firstChar]) {
              acc[firstChar] = []; // Initialize an array for the letter if it doesn't exist
            }
            acc[firstChar].push(item); // Add the item to the respective letter's array
            return acc;
          }, {});
          let count = 0;
          for (const key in groupedCategories) {
            if (groupedCategories.hasOwnProperty(key)) {
              list[count] = {
                category: key,
                list: [...groupedCategories[key]],
              };
              count++;
            }
          }
          setCategory(list);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();
  }, []);

  console.log(category);
  return (
    <section className={cx("category")}>
      <Header />
      <h1> CATEGORY </h1>
      <div className={cx("content")}>
        {category.map((item, index) => (
          <React.Fragment key={index}>
            {item.category && <h2>{item.category}:</h2>}
            {item.list?.map((items, indexs) => (
              <React.Fragment key={indexs}>
                <Popover
                  style={{ width: 500 }}
                  content={hoverContent}
                  title="Hover title"
                  trigger="hover"
                >
                  <div>
                    <Link to={`/category/:${items.id}`}>{items.name}</Link>
                  </div>
                </Popover>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default List;

//<React.Fragment dùng thay div
