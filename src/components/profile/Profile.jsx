import React, { useState, useEffect, useRef } from 'react'
import styles from "./Profile.module.scss";
import classNames from "classnames/bind";
import Draggable from 'react-draggable';
import Swal from "sweetalert2";
import AuthUser from '../../utils/AuthUser';
import FormattedDate from '../../utils/FormattedDate';
import dayjs from 'dayjs';
import { avatarSelector } from '../../redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { MdDiamond } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { storage } from '../../utils/firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { addAvatar } from '../../redux/actions';
import { DatePicker, Divider, Form, Input, Modal, Select, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { FaCheckCircle, FaInfoCircle, FaUser, FaAsterisk } from 'react-icons/fa';
import { GrShieldSecurity } from 'react-icons/gr'
import moment from 'moment/moment';

const cx = classNames.bind(styles)

const Profile = ({ userInfo }) => {
  const { http } = AuthUser();
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

  // Successful case
  const onFinishUpdateProfile = (values) => {
    const { fullName, gender, birthDate, email, ID_Card, address, phone } = values;
    const formData = new FormData();

    formData.append('full_name', fullName);
    formData.append('gender', gender);
    formData.append('birthday', FormattedDate(birthDate));
    formData.append('email', email);
    formData.append('CMND', ID_Card);
    formData.append('address', address);
    formData.append('phone', phone);

    http.patch(`/customer/update-customer`, formData)
      .then(() => {
        Swal.fire(
          'Update!',
          'You have successfully update your profile',
          'success'
        ).then(() => {
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

  // Successful case
  const onFinishUpdatePassword = (values) => {
    const formData = new FormData();

    formData.append('current_password', values.currentPassword);
    formData.append('new_password', values.newPassword);
    formData.append('confirm_password', values.confirmNewPassword);

    http.patch('/auth/changePassword', formData)
      .then((resolve) => {
        console.log(resolve);
        Swal.fire(
          'Successfully Update Password!',
          'You have successfully update your password',
          'success'
        ).then(() => {
          navigate(0);
        })
      })
      .catch((reject) => {
        console.log(reject);
        const errorMsg = reject.response.data.message;
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
            {userInfo?.name ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
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
            {userInfo?.gender ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
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
            {userInfo?.name ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
          </div>
        </div>
        <div className={cx("info-container")}>
          <div className={cx("info-container__left")}>
            <div className={cx("title-text")}>
              <p>Number of followers</p>
            </div>
            <div className={cx("content-text")}>{userInfo?.name ?? "No information provided"}</div>
          </div>
          <div className={cx("info-container__right")}>
            {userInfo?.name ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
          </div>
        </div>
        <div className={cx("info-container")}>
          <div className={cx("info-container__left")}>
            <div className={cx("title-text")}>
              <p>Number of following</p>
            </div>
            <div className={cx("content-text")}>{userInfo?.name ?? "No information provided"}</div>
          </div>
          <div className={cx("info-container__right")}>
            {userInfo?.name ? <FaCheckCircle /> : <FaInfoCircle style={{ color: 'grey' }} />}
          </div>
        </div>
      </div>
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
            'fullName': userInfo?.name,
            'gender': userInfo?.gender,
            'birthDate': userInfo?.birthday ? dayjs(userInfo?.birthday) : dayjs(),
            'ID_Card': userInfo?.CMND,
            'address': userInfo?.address,
            'phone': userInfo?.phone,
          }}
        >
          <Form.Item
            name='fullName'
            label="Full Name"
            rules={[
              {
                required: true,
                message: 'Full name is required!'
              },
            ]}
            hasFeedback
          >
            <Input
              placeholder={userInfo?.full_name}
            />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Gender is required!',
              },
            ]}
          >
            <Select placeholder="Please select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
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
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: 'Current password is required!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder='Enter current password' />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
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
            name="confirmNewPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
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