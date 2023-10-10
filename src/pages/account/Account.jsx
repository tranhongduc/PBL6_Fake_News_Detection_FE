import React from "react"
import avatar from "../../assets/images/avatar.png"
import styles from './Account.module.scss'
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Account = () => {
  return (
    <>
      <section className={cx("accountInfo")}>
        <div className={cx("container boxItems")}>
          <h1>Account Information</h1>
          <div className={cx("content")}>
            <div className={cx("left")}>
              <div className={cx("img flexCenter")}>
                <input type='file' accept='image/*' src={avatar} alt='img' />
                <img src={avatar} alt='image' class='image-preview' />
              </div>
            </div>
            <div className={cx("right")}>
              <label htmlFor=''>Username</label>
              <input type='text' />
              <label htmlFor=''>Email</label>
              <input type='email' />
              <label htmlFor=''>Password</label>
              <input type='password' />
              <button className={cx("button")}>Update</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Account
