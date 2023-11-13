import React, { useState } from "react";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import logo from "../../assets/images/logo.svg";
import facebookIcon from "../../assets/images/facebook.png";
import googleIcon from "../../assets/images/google.png";
import gif_cat from "../../assets/images/cat.gif";
import carousel1 from "../../assets/images/carousel1.png";
import carousel2 from "../../assets/images/carousel2.png";
import carousel3 from "../../assets/images/carousel3.png";
import { Form, Button, Checkbox, Input, Divider, Modal } from "antd";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from "../../utils/AuthUser";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

const Login = () => {
  const slides = [
    { url: carousel1, title: "Carousel 1" },
    { url: carousel2, title: "Carousel 2" },
    { url: carousel3, title: "Carousel 3" },
  ];

  const loginFormLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 24,
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

  const { http, refreshToken, saveToken, saveUsername, saveUserRole, setAuthorizationHeader } = AuthUser();
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
        console.log(resolve);

        const { access_token, refresh_token } = resolve.data;
        const user = resolve.data.user;
        saveToken(access_token, refresh_token);
        saveUsername(user.username);
        saveUserRole(user.role);

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
        <div className={cx("login-container")}>
          <div className={cx("login-container__logo")}>
            <Link to="/">
              <img src={logo} alt="Logo" width={100} height={54} />
            </Link>
          </div>
          <div className={cx("login-container__main")}>
            <div>
              <h1 className={cx("title")}>Login</h1>
              <p className={cx("title-description")}>
                Login to access most amazing blogger system!
              </p>
            </div>
            <div className={cx("form-container")}>
              <Form
                {...loginFormLayout}
                form={form}
                layout="vertical"
                name="login_form"
                labelAlign="left"
                labelWrap="true"
                size="large"
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                  remember: true,
                }}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Email is required!",
                    },
                    {
                      type: "email",
                      message: "Invalid email address!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder="john.doe@gmail.com"
                    autoComplete="email"
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password is required!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="******"
                    autoComplete="current-password"
                  />
                </Form.Item>
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  wrapperCol={{
                    span: 12,
                  }}
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <p className={cx("forgot__password")}>
                  <Link
                    to="/forgot-password"
                    className={cx("forgot__password__link")}
                  >
                    Forgot Password
                  </Link>
                </p>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={cx("button")}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className={cx("signup")}>
              <div className={cx("signup__title")}>
                Don't have an account yet?
              </div>
              <div>
                <Link to="/register" className={cx("signup__link")}>
                  Sign up here
                </Link>
              </div>
            </div>
            <Divider plain orientation="center" className={cx("seperate-line")}>
              Or login with
            </Divider>
            <div className={cx("social-media")}>
              <a href="/" className={cx("social-media__link")}>
                <Button
                  className={cx("social-media__button")}
                  onClick={(e) => handleLoginBySocial(e)}
                >
                  <img
                    src={facebookIcon}
                    className={cx("social-media__icon")}
                    alt="facebook icon"
                  />
                </Button>
              </a>
              <a href="/" className={cx("social-media__link")}>
                <Button
                  className={cx("social-media__button")}
                  onClick={(e) => handleLoginBySocial(e)}
                >
                  <img
                    src={googleIcon}
                    className={cx("social-media__icon")}
                    alt="google icon"
                  />
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
        title="Feature under development"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" key="back" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <div className={cx("wrapper__modal")}>
          <h1 style={{ textAlign: "center" }}>
            We will soon complete this feature (◍•ᴗ•◍)♡ ✧*
          </h1>
          <img src={gif_cat} alt="Cat meowwing" width={80} />
        </div>
      </Modal>
    </div>
  );
};

export default Login;
