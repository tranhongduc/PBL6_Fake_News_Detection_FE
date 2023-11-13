import React from "react"
import styles from './Footer.module.scss'
import classNames from "classnames/bind";
import { AiFillTwitterCircle, AiFillLinkedin } from "react-icons/ai"
import { BsFacebook } from "react-icons/bs"
import { RiInstagramFill } from "react-icons/ri"

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <footer className={cx("boxItems")}>
      <div className={cx("container", "flex")}>
        <p>Cartsy Medicine - All right reserved - Design & Developed by RedQ, Inc</p>
        <div className={cx("social")}>
          <BsFacebook className={cx("icon")} />
          <RiInstagramFill className={cx("icon")} />
          <AiFillTwitterCircle className={cx("icon")} />
          <AiFillLinkedin className={cx("icon")} />
        </div>
      </div>
    </footer>
  )
}

export default Footer
