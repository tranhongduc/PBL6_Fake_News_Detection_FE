import React, { useState, useEffect } from "react"
import styles from './Header.module.scss'
import classNames from "classnames/bind";
import logo from "../../assets/images/logo.svg"
import placeholderAvatar from "../../assets/images/default-user-icon.jpg"
import { Link } from "react-router-dom"
import { Divider, Popover } from 'antd'
import { FaUser } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FiLogIn } from 'react-icons/fi'
import AuthUser from "../../utils/AuthUser";
import { avatarSelector } from '../../redux/selectors';
import { ref, getDownloadURL } from "firebase/storage"
import { storage } from '../../utils/firebase'
import { useDispatch, useSelector } from 'react-redux';
import { addAvatar } from '../../redux/actions';

const cx = classNames.bind(styles);

const Header = () => {

  const { accessToken, username, avatar, logout } = AuthUser();  
  
  // Create a reference from a Google Cloud Storage URI
  const localAvatar = useSelector(avatarSelector);
  const avatarRef = ref(storage, localAvatar ? localAvatar : avatar);
  const dispatch = useDispatch();

  const handleLogout = () => {
    logout()
  }

  const [isLoggedIn, ] = useState(() => {
    return accessToken !== null ? true : false
  })

  const title = (
    <div className={cx("title-wrapper")}>
      <h3>{username}</h3>
      <Divider className={cx("seperate-line")} />
    </div>
  )

  const content = (
    <div className={cx("content-wrapper")}>
      <div className={cx("content-wrapper__link")}>
        <Link to="/manage-account" className={cx("content-wrapper__link-item")}>
          <FaUser />
          <p>Manage Account</p>
        </Link>
      </div>
      <Divider className={cx("seperate-line")} />
      <button className={cx("content-wrapper__logout")} onClick={handleLogout}>
        <FiLogOut size={16} />
        <p>Logout</p>
      </button>
    </div>
  );

  // --------------------------     Fetch API     --------------------------

  useEffect(() => {
    const fetchAvatar = () => {
      getDownloadURL(avatarRef).then(url => {
        dispatch(addAvatar(url));
      })
    }

    fetchAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className={cx("header")}>
      <div className={cx("header__left")}>
        <div className={cx("logo")}>
          <img src={logo} alt='logo' width='100px' />
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
                </>
              ) : (
                <>
                  <Link to="/">Home</Link>
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
      <div className={cx("header__right")} >
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
                <Popover content={content} title={title} trigger='click'>
                  <LazyLoadImage
                    key={localAvatar}
                    src={localAvatar}
                    alt="Avatar"
                    effect="blur"
                    placeholderSrc={placeholderAvatar}
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
  )
}

export default Header
