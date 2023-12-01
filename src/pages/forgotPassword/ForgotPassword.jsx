import React, { useState } from "react";
import styles from "./ForgotPassword.module.scss";
import classNames from "classnames/bind";
import logo from "../../assets/images/logo.svg";
import facebookIcon from "../../assets/images/facebook.png";
import googleIcon from "../../assets/images/google.png";
import gif_cat from "../../assets/images/cat.gif";
import carousel1 from "../../assets/images/carousel1.png";
import carousel2 from "../../assets/images/carousel2.png";
import carousel3 from "../../assets/images/carousel3.png";
import { Form, Button, Input, Divider, Modal } from "antd";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from "../../utils/AuthUser";
import { toast } from "react-toastify";
import { BiArrowBack } from 'react-icons/bi'

const cx = classNames.bind(styles);

const ForgotPassword = () => {
  const slides = [
    { url: carousel1, title: "Carousel 1" },
    { url: carousel2, title: "Carousel 2" },
    { url: carousel3, title: "Carousel 3" },
  ];

  const forgotPasswormFormLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 24
    },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginBySocial = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const { http, refreshToken, saveToken, setAuthorizationHeader } = AuthUser();
  const [form] = Form.useForm();

  const ROLE_ADMIN = "admin";
  const ROLE_USER = "user";

  const onFinish = (values) => {
    const formData = new FormData();

    formData.append("email", values.email);
    formData.append("password", values.password);

    if (refreshToken != null) {
      setAuthorizationHeader(refreshToken);
    }

    http.post("/auth/login/", formData)
      .then((resolve) => {
        console.log('Resolve:',resolve);

        const { access_token, refresh_token } = resolve.data;
        const user = resolve.data.user;

        saveToken(access_token, refresh_token, user);

        if (user.role === ROLE_USER) {
          navigate("/")
          toast.success(`Welcome back ${user.username}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else if (user.role === ROLE_ADMIN) {
          navigate("/admin");
          toast.success(`Welcome back admin ${user.username}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      })
      .catch((reject) => {
        console.log(reject);
        toast.error("Email or password is incorrect..", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    toast.error("Please input all fields", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("wrapper__left")}>
        <div className={cx("forgot-password-container")}>
          <div className={cx("forgot-password-container__logo")}>
            <Link to='/'>
              <img src={logo} alt='Logo' width={100} height={54} />
            </Link>
          </div>
          <div className={cx("forgot-password-container__main")}>
            <div>
              <Link to="/login" id="login-link" className={cx("login__link")}>
                <BiArrowBack />
                <h3>Back to login</h3>
              </Link>
              <h1 className={cx("title")}>Forgot Your Password?</h1>
              <p className={cx("title-description")}>Don't worry, happens to all of us. Enter your email below to recover your password.</p>
            </div>
            <div className={cx("form-container")}>
              <Form
                {...forgotPasswormFormLayout}
                form={form}
                layout='vertical'
                name='forgot_password_form'
                labelAlign='left'
                labelWrap='true'
                size='large'
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Email is required!',
                    },
                    {
                      type: 'email',
                      message: 'Invalid email address!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder='john.doe@gmail.com'
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button type="primary" htmlType="submit" className={cx("button")}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <Divider
              plain
              orientation='center'
              className={cx("seperate-line")}
            >
              Or login with
            </Divider>
            <div className={cx("social-media")}>
              <a href="/" className={cx("social-media__link")}>
                <Button 
                  className={cx("social-media__button")}
                  onClick={(e) => handleLoginBySocial(e)}
                >
                  <img src={facebookIcon} className={cx("social-media__icon")} alt='facebook icon' />
                </Button>
              </a>
              <a href="/" className={cx("social-media__link")}>
                <Button 
                  className={cx("social-media__button")}
                  onClick={(e) => handleLoginBySocial(e)}
                >
                  <img src={googleIcon} className={cx("social-media__icon")} alt='google icon' />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={cx("wrapper__right")}>
        <ImageSlider slides={slides} parentWidth={600} />
      </div>
      <Modal
        title="Tính năng đang phát triển"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" key="back" onClick={handleOk}>OK</Button>,
        ]}
      >
        <div className={cx("wrapper__modal")}>
            <h1 style={{textAlign: 'center'}}>Chúng tôi sẽ sớm hoàn thành tính năng này (◍•ᴗ•◍)♡ ✧*</h1>
            <img src={gif_cat} alt="Cat meowwing" width={80} />
        </div>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
