import React, { useState } from 'react'
import styles from './Register.module.scss'
import classNames from 'classnames/bind'
import logo from "../../assets/images/logo.svg"
import facebookIcon from '../../assets/images/facebook.png'
import googleIcon from '../../assets/images/google.png'
import gif_cat from '../../assets/images/cat.gif'
import carousel1 from '../../assets/images/carousel1.png'
import carousel2 from '../../assets/images/carousel2.png'
import carousel3 from '../../assets/images/carousel3.png'
import ImageSlider from '../../components/imageSlider/ImageSlider';
import { Form, Button, Input, Divider, Modal } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import AuthUser from '../../utils/AuthUser';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

const cx = classNames.bind(styles);

const Register = () => {

  const slides = [
    { url: carousel1, title: 'Carousel 1' },
    { url: carousel2, title: 'Carousel 2' },
    { url: carousel3, title: 'Carousel 3' },
  ]

  const registerFormLayout = {
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
  }

  const handleOk = () => {
    setIsModalOpen(false);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const { http } = AuthUser(); 
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    const ENABLED_ACCOUNT = 1;
    const ROLE_CUSTOMER_ID = 3;
    const DEFAULT_USER_AVATAR = 'gs://ltd-resort.appspot.com/avatars/default-user-icon.jpg';

    const formData = new FormData();
    
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirm_password', values.confirmPassword);
    formData.append('avatar', DEFAULT_USER_AVATAR)
    formData.append('enabled', ENABLED_ACCOUNT);
    formData.append('role_id', ROLE_CUSTOMER_ID);

    http.post('/auth/register', formData)
      .then((resolve) => {
        console.log(resolve);
        Swal.fire(
          'Created!',
          'You have successfully registered an account',
          'success'
        ).then(() => {
          navigate('/login');
        })
      })
      .catch((reject) => {
        const { username, email, password, confirm_password } = reject.response.data.message;
        if (username !== "") {
          toast.error(username, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })
        } else if (email !== "") {
          toast.error(email, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })
        } else if (password !== "") {
          toast.error(password, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })
        } else if (confirm_password !== "") {
          toast.error(confirm_password, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })
        } else {
          toast.error('Oops. Try again', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          })
        }
      })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed: ', errorInfo);
    toast.error('Please input all fields!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    })
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("wrapper__left")}>
        <ImageSlider slides={slides} parentWidth={600} />
      </div>
      <div className={cx("wrapper__right")}>
        <div className={cx("register-container")}>
          <Link to='/'>
            <img src={logo} alt='Logo' width={100} height={54} />
          </Link>
          <div className={cx("register-container__main")}>
            <div>
              <h1 className={cx("title")}>Sign up</h1>
              <p className={cx("title-description")}>Let's sign up and make a wonderful journey!</p>
            </div>
            <div>
              <Form
                {...registerFormLayout}
                form={form}
                layout='vertical'
                name='register_form'
                labelAlign='left'
                labelWrap='true'
                size='large'
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: 'Username is required!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder='John Doe'
                    autoComplete='username'
                  />
                </Form.Item>
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
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Password is required!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder='******'
                    autoComplete='new-password'
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    placeholder='******'
                    autoComplete='new-password'
                  />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button type="primary" htmlType="submit" className={cx("button")}>
                    Sign up
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className={cx("login")}>
              <div className={cx("login__title")}>Already have an account yet?</div>
              <div>
                <Link to="/login" className={cx("login__link")}>
                  Login here
                </Link>
              </div>
            </div>
            <Divider
              plain
              orientation='center'
              className={cx("seperate-line")}
            >
              Or sign up with
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
      <Modal
        title="Feature under development"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" key="back" onClick={handleOk}>OK</Button>,
        ]}
      >
        <div className={cx("wrapper__modal")}>
            <h1 style={{textAlign: 'center'}}>We will soon complete this feature (◍•ᴗ•◍)♡ ✧*</h1>
            <img src={gif_cat} alt="Cat meowwing" width={80} />
        </div>
      </Modal>
    </div>
  )
}

export default Register