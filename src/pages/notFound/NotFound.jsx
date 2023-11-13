import React from 'react'
import styles from "./NotFound.module.scss";
import classNames from "classnames/bind";
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/')
  }
  
  return (
    <div className={cx("not-found-wrapper")}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={handleClick}>Back Home</Button>}
      />
    </div>
  )
}

export default NotFound