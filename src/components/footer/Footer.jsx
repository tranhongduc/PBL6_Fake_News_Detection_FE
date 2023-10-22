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
      <div className='container flex'>
        <p>Cartsy Medicine - All right reserved - Design & Developed by RedQ, Inc</p>
        <div className='social'>
          <BsFacebook className='icon' />
          <RiInstagramFill className='icon' />
          <AiFillTwitterCircle className='icon' />
          <AiFillLinkedin className='icon' />
        </div>
      </div>
    </footer>
  )
}

export default Footer
