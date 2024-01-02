import React, { useState, useEffect, useRef } from 'react'
import styles from "./ManageAccount.module.scss";
import classNames from "classnames/bind";
import Swal from "sweetalert2";
import AuthUser from '../../utils/AuthUser';
import background from '../../assets/images/background.jpeg'
import ConfirmationToast from '../../components/ConfirmationToast/ConfirmationToast';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { storage } from '../../utils/firebase'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { addAvatar } from '../../redux/actions';
import { Form, Steps } from 'antd';
import Profile from "../../components/profile/Profile"
import MyBlog from "../../components/myBlog/MyBlog"
import SavedBlog from "../../components/savedBlog/SavedBlog"
import Header from "../../components/header/Header"
import Footer from "../../components/footer/Footer"
import { FaBookmark, FaUser, FaNewspaper } from "react-icons/fa";
import { avatarSelector } from "../../redux/selectors";

const cx = classNames.bind(styles);

const ManageAccount = () => {

  const { http, accessToken, userId, setAuthorizationHeader } = AuthUser();

  // Fetch user info state
  const [userInfo, setUserInfo] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);
  const onChange = (value) => {
    setCurrent(value);
  };

  // Create a reference from a Google Cloud Storage URI
  const avatar = useSelector(avatarSelector);

  const fileInputRef = useRef(null);

  const handleChangeAvatar = () => {
    document.getElementById('fileInput').click();
  }

  const handleCancel = () => {
    // Đặt giá trị của input thành null
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile !== imageUpload) {
        toast.info(
          <ConfirmationToast
            message="Do you want to save new avatar?"
            onConfirm={() => uploadImage(selectedFile)}
            onCancel={() => setImageUpload(handleCancel)}
          />, {
          position: "top-center",
          closeOnClick: true,
          draggable: false,
          progress: 1,
          theme: "colored",
          style: { cursor: 'default' },
        })
      }
    }
  }

  const uploadImage = (file) => {
    // Gửi đường dẫn ảnh đến Django để lưu vào database
    // (Sử dụng API hoặc các phương thức khác để thực hiện tác vụ này)

    const avatarRef = ref(storage, `avatars/${file.name + v4()}`);
    uploadBytes(avatarRef, file).then(() => {
      getDownloadURL(avatarRef).then((url) => {
        // Upload ảnh lên Firebase Storage
        const formData = new FormData();
        
        formData.append('avatar', url);

        http.patch(`user/update-avatar`, formData)
          .then((resolve) => {
            console.log(resolve);
            Swal.fire(
              'Update!',
              'You have successfully update your avatar',
              'success'
            ).then(() => {
              dispatch(addAvatar(url));
              navigate(0);
            })
          })
          .catch((reject) => {
            console.log(reject);
            Swal.fire(
              'Error!',
              'Oops... Try again',
              'error'
            ).then(() => {
              navigate(0);
            })
          })
      })
    })
  }

  // ---------------------------  Set field for date input  ---------------------------
  const [form] = Form.useForm();

  const items = [
    {
      title: 'Profile',
      content: <Profile userInfo={userInfo} />,
      icon: <FaUser />,
    },
    {
      title: 'My Blog',
      content: <MyBlog />,
      icon: <FaNewspaper />,
    },
    {
      title: 'Saved Blog',
      content: <SavedBlog />,
      icon: <FaBookmark />,
    },
  ]

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    if (accessToken != null) {
      setAuthorizationHeader(accessToken);
    }

    const fetchData = () => {
      http.get(`/admin/detail-user/${userId}`)
        .then((resolve) => {
          console.log(resolve);
          setUserInfo(resolve.data);
        })
        .catch((reject) => {
          console.log(reject);
        })
    }

    fetchData();
    setIsLoading(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isLoading) {
    return (
      <></>
    )
  } else {
    return (
      <div className={cx("manage-account-wrapper")}>
        <Header />
        <div className={cx("manage-account-wrapper__top")}>
          <div className={cx("image-bg")} >
            <img
              src={background}
              alt="Background Manage Account"
            />
          </div>
          <div className={cx("image-avatar")}>
            <div className={cx("avatar-container")}>
              <img
                src={avatar}
                alt="User Avatar"
              />
              <button
                className={cx("btn-edit")}
                onClick={handleChangeAvatar}
              >
                <input
                  type="file"
                  id="fileInput"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <FontAwesomeIcon icon={faPen} />
              </button>
            </div>
            <h1>{userInfo?.username}</h1>
            <p>{userInfo?.email}</p>
          </div>
        </div>

        <div className={cx("manage-account-wrapper__bottom")}>
          <div className={cx("action")}>
            <Steps
              current={current}
              items={items}
              type="navigation"
              onChange={onChange}
            />
          </div>
          <div className={cx("content")}>{items[current].content}</div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default ManageAccount