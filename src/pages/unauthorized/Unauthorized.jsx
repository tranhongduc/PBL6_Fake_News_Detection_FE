import React from 'react'
import styles from "./Unauthorized.module.scss";
import classNames from "classnames/bind";
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <div className={cx("unauthorized-wrapper")}>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={handleClick}>Go to login page</Button>}
      />
    </div>
  )
}

export default Unauthorized