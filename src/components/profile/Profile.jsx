import React, { useState, useRef } from 'react'
import styles from "./Profile.module.scss";
import classNames from "classnames/bind";
import Draggable from 'react-draggable';
import Swal from "sweetalert2";
import AuthUser from '../../utils/AuthUser';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Divider, Form, Input, Modal, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FaCheckCircle, FaInfoCircle, FaUser } from 'react-icons/fa';
import { GrShieldSecurity } from 'react-icons/gr'
import moment from 'moment/moment';

const cx = classNames.bind(styles)

const Profile = ({ userInfo }) => {
  const { http, accessToken, setAuthorizationHeader, updateProfile } = AuthUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateProfileFormLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
    },
  };

  const updatePasswordFormLayout = {
    labelCol: {
      span: 10
    },
    wrapperCol: {
      span: 14
    },
  };


  const [openModalUpdateInfo, setOpenModalUpdateInfo] = useState(false);
  const [openModalUpdatePassword, setOpenModalUpdatePassword] = useState(false);

  // ---------------------------  Set field for date input  ---------------------------
  const [form] = Form.useForm();

  const handleChange = () => {
    setOpenModalUpdateInfo(true);
  }

  // Handle click out boundary of modal 
  const handleOkUpdateInfoModal = () => {
    setOpenModalUpdateInfo(false);
  }

  // Handle click button "X" of modal
  const handleCancelUpdateInfoModal = () => {
    setOpenModalUpdateInfo(false);
  }

  const handleUpdatePassword = () => {
    setOpenModalUpdatePassword(true);
  }

  // Handle click out boundary of modal 
  const handleOkUpdatePasswordModal = () => {
    setOpenModalUpdatePassword(false);
  }

  // Handle click button "X" of modal
  const handleCancelUpdatePasswordModal = () => {
    setOpenModalUpdatePassword(false);
  }

  // ---------------------------  Handle Update Info  ---------------------------

  // Successful case
  const onFinishUpdateProfile = (values) => {
    const { username, email } = values;
    const formData = new FormData();

    formData.append('username', username);
    formData.append('email', email);

    if (accessToken != null) {
      setAuthorizationHeader(accessToken)
    }

    http.put('admin/update_profile/', formData)
      .then(() => {
        Swal.fire(
          'Update!',
          'You have successfully update your profile',
          'success'
        ).then(() => {
          updateProfile(username)
          navigate(0);
        })
      })
      .catch((reject) => {
        console.log(reject);
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
      })
  }

  // Failed case
  const onFinishUpdateProfileFailed = (error) => {
    console.log('Error: ', error)
    toast.error('Update failed!', {
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

  // ---------------------------  Handle Change Password  ---------------------------

  // Successful case
  const onFinishUpdatePassword = (values) => {
    const formData = new FormData();

    formData.append('old_password', values.old_password);
    formData.append('new_password', values.new_password);
    formData.append('confirm_new_password', values.confirm_new_password);
    
    if (accessToken != null) {
      setAuthorizationHeader(accessToken)
    }

    http.put('auth/change_password/', formData)
      .then((resolve) => {
        console.log(resolve);
        Swal.fire(
          'Successfully Update Password!',
          'You\'ve successfully updated your password',
          'success'
        ).then(() => {
          navigate(0);
        })
      })
      .catch((reject) => {
        console.log(reject);
        const { new_password, confirm_new_password } = reject.response.data;
        
        if (new_password != null) {
          var errorMsg = new_password[0];
        } else if (confirm_new_password != null) { 
          var errorMsg = confirm_new_password[0];
        }
        else {
          errorMsg = 'Oops. Try again';
        }
        Swal.fire(
          'Oops!',
          `${errorMsg}`,
          'error'
        )
      })
  }

  // Failed case
  const onFinishUpdatePasswordFailed = (error) => {
    console.log('Error: ', error)
    toast.error('Update failed!', {
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

  // ---------------------------      Modal Draggable      ---------------------------
  const draggleRef = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <div className={cx("account-info-wrapper")}>
      <div className={cx("account-info-wrapper__top")}>
        <h1 className={cx("header")}>Account Information</h1>
        <div className={cx("btn-wrapper")}>
          <button
            className={cx("btn-change")}
            onClick={handleChange}
          >
            <EditOutlined />
            <span>Update Info</span>
          </button>
          <button
            className={cx("btn-update-password")}
            onClick={handleUpdatePassword}
          >
            <GrShieldSecurity size={20} />
            <span>Update Password</span>
          </button>
        </div>
      </div>
      <Divider className={cx("seperate-line")} />
      <div className={cx("account-info-wrapper__bottom")}>
        <div className={cx("info-container")}>
          <div className={cx("info-container__left")}>
            <div className={cx("title-text")}>
              <p>Username</p>
            </div>
            <div className={cx("content-text")}>{userInfo?.username ?? "No information provided"}</div>
          </div>
          <div className={cx("info-container__right")}>
            {userInfo?.username !== undefined ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
          </div>
        </div>
        <div className={cx("info-container")}>
          <div className={cx("info-container__left")}>
            <div className={cx("title-text")}>
              <p>Email</p>
            </div>
            <div className={cx("content-text")}>{userInfo?.email ?? "No information provided"}</div>
          </div>
          <div className={cx("info-container__right")}>
            {userInfo?.email !== undefined ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
          </div>
        </div>
        <div className={cx("info-container")}>
          <div className={cx("info-container__left")}>
            <div className={cx("title-text")}>
              <p>Joined Date</p>
            </div>
            <div className={cx("content-text")}>{moment(userInfo?.created_at).format('DD/MM/YYYY') ?? "No information provided"}</div>
          </div>
          <div className={cx("info-container__right")}>
            {moment(userInfo?.created_at).format('DD/MM/YYYY') ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
          </div>
        </div>
        <div className={cx("info-container")}>
          <div className={cx("info-container__left")}>
            <div className={cx("title-text")}>
              <p>Number of followers</p>
            </div>
            <div className={cx("content-text")}>
              {userInfo?.total_following_you !== undefined ? (
                userInfo.total_following_you <= 1 ? (
                  `${userInfo.total_following_you} Follower`
                ) : (
                  `${userInfo.total_following_you} Followers`
                )
              ) : (
                "No information provided"
              )}
            </div>
          </div>
          <div className={cx("info-container__right")}>
            {userInfo?.total_following_you !== undefined ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
          </div>
        </div>
        <div className={cx("info-container")}>
          <div className={cx("info-container__left")}>
            <div className={cx("title-text")}>
              <p>Number of following</p>
            </div>
            <div className={cx("content-text")}>
              {userInfo?.total_you_follow !== undefined ? (
                userInfo.total_you_follow <= 1 ? (
                  `${userInfo.total_you_follow} Following`
                ) : (
                  `${userInfo.total_you_follow} Followings`
                )
              ) : (
                "No information provided"
              )}
            </div>
          </div>
          <div className={cx("info-container__right")}>
            {userInfo?.total_you_follow !== undefined ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
          </div>
        </div>
      </div>
      {/* Update Info Modal */}
      <Modal
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
              textAlign: 'center',
              marginBottom: 24
            }}
            onMouseOver={() => {
              setDisabled(false);
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
          >
            Update Profile
            <FaUser style={{ marginLeft: 16 }} />
          </div>
        }
        open={openModalUpdateInfo}
        onOk={handleOkUpdateInfoModal}
        onCancel={handleCancelUpdateInfoModal}
        footer={null}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Form
          {...updateProfileFormLayout}
          form={form}
          layout='horizontal'
          name='update_profile_form'
          labelAlign='right'
          labelWrap='true'
          size='large'
          autoComplete="off"
          onFinish={onFinishUpdateProfile}
          onFinishFailed={onFinishUpdateProfileFailed}
          className={cx("modal-form")}
          initialValues={{
            'username': userInfo?.username,
            'email': userInfo?.email,
          }}
        >
          <Form.Item
            name='username'
            label="User Name"
            rules={[
              {
                required: true,
                message: 'User Name is required!'
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='email'
            label="Email"
            rules={[
              {
                required: true,
                message: 'Email is required!'
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={24}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {/* Change Password Modal */}
      <Modal
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
              textAlign: 'center',
              marginBottom: 24
            }}
            onMouseOver={() => {
              setDisabled(false);
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
          >
            Update Password
            <GrShieldSecurity size={20} style={{ marginLeft: 16 }} />
          </div>
        }
        className={cx("modal-wrapper")}
        open={openModalUpdatePassword}
        onOk={handleOkUpdatePasswordModal}
        onCancel={handleCancelUpdatePasswordModal}
        footer={null}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Form
          {...updatePasswordFormLayout}
          form={form}
          layout='horizontal'
          name='update_password_form'
          labelAlign='right'
          labelWrap='true'
          size='large'
          autoComplete="off"
          onFinish={onFinishUpdatePassword}
          onFinishFailed={onFinishUpdatePasswordFailed}
          className={cx("modal-form")}
        >
          <Form.Item
            label="Old Password"
            name="old_password"
            rules={[
              {
                required: true,
                message: 'Old password is required!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder='Enter old password' />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="new_password"
            rules={[
              {
                required: true,
                message: 'New password is required!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder='Enter new password' />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirm_new_password"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder='Confirm new password' />
          </Form.Item>
          <Form.Item
            wrapperCol={24}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Profile