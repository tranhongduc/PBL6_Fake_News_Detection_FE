import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import logo from "../../assets/images/logo.svg";
import avatar from "../../assets/images/avatar.png";
import { nav } from "../../assets/data/data";
import { Link } from "react-router-dom";
import { Divider, Popover } from "antd";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FiLogIn } from "react-icons/fi";
import AuthUser from "../../utils/AuthUser";
const cx = classNames.bind(styles);

const Header = () => {
  const { accessToken, username, logout, http } = AuthUser();
  const [isSidebar, setIsSidebar] = useState(true);

  const [category, setCategory] = useState([]);
  const [list, setList] = useState([]);

  const handleLogout = () => {
    logout();
  };

  const [isLoggedIn] = useState(() => {
    return accessToken !== null ? true : false;
  });

  const title = (
    <div className={cx("title-wrapper")}>
      <h3>{username}</h3>
      <Divider className={cx("seperate-line")} />
    </div>
  );

  const hoverContent = (
    <div className={cx("content")}>
      {category.map((item, index) => (
        <React.Fragment key={index}>
          {item.category && <h2>{item.category}:</h2>}
          {item.list?.map((items, indexs) => (
            <React.Fragment key={indexs}>
              <Link to={`/category/:${items.id}`}>{items.name}</Link>
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );

  const content = (
    <div className={cx("content-wrapper")}>
      <div className={cx("content-wrapper__link")}>
        <Link to="/user-profile" className={cx("content-wrapper__link-item")}>
          <FaUser />
          <p>User Profile</p>
        </Link>
      </div>
      <Divider className={cx("seperate-line")} />
      <button className={cx("content-wrapper__logout")} onClick={handleLogout}>
        <FiLogOut size={16} />
        <p>Logout</p>
      </button>
    </div>
  );

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

  return (
    <header className={cx("header")}>
      <div className={cx("header__left")}>
        <div className={cx("logo")}>
          <img src={logo} alt="logo" width="100px" />
        </div>
      </div>
      <div className={cx("header__middle")}>
        <nav>
          <ul>
            <li>
              {isLoggedIn ? (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/create">Create Post</Link>
                  <Link to="/category">Category</Link>
                  <Popover
                    style={{ width: 500 }}
                    content={hoverContent}
                    title="Hover title"
                    trigger="hover"
                  >
                    sss
                  </Popover>
                </>
              ) : (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/category">Category</Link>

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
                              visible={true}
                            >
                              <div>
                                <Link to={`/category/:${items.id}`}>
                                  {items.name}
                                </Link>
                              </div>
                            </Popover>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
      <div className={cx("header__right")}>
        {isLoggedIn ? (
          <>
            <div className={cx("header__right-info")}>
              <div className={cx("info-container")}>
                <div className={cx("info-container__welcome")}>WELCOME</div>
                <div className={cx("info-container__name")}>{username}</div>
              </div>
            </div>
            <div className={cx("header__right-avatar")}>
              <div className={cx("avatar")}>
                <Popover content={content} title={title} trigger="click">
                  <LazyLoadImage
                    key={avatar}
                    src={avatar}
                    alt="Avatar"
                    effect="blur"
                    placeholderSrc={avatar}
                  />
                </Popover>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login">
            <button className={cx("btn-login")}>
              <FiLogIn size={18} />
              <span className={cx("btn-login__title")}>Login</span>
            </button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
