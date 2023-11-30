import React from 'react'
import styles from "./UserProfileModal.module.scss";
import classNames from "classnames/bind";
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { MdDiamond } from 'react-icons/md';

const cx = classNames.bind(styles);

const UserProfileModal = ({
  avatar,
  username,
  email,
}) => {

  const RANKING_BRONZE = "Bronze";
  const RANKING_SILVER = "Silver";
  const RANKING_GOLD = "Gold";
  const RANKING_PLATINUM = "Platinum";
  const RANKING_DIAMOND = "Diamond";

  return (
    <div className={cx("user-profile-wrapper")}>
      <h1>User Profile</h1>
      <div className={cx("user-profile-wrapper__top")}>
        <img src={avatar} alt='Avatar' />
        <h2>{username}</h2>
      </div>
      <div className={cx("user-profile-wrapper__bottom")}>
        
      </div>
    </div>
  )
}

export default UserProfileModal