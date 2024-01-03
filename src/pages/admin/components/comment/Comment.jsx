import React, { useState, useEffect, useRef } from "react";
import styles from "./Comment.module.scss";
import classNames from "classnames/bind";
import { BsFlagFill } from "react-icons/bs";
import { Button, Modal } from "antd";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../utils/firebase";
import Draggable from "react-draggable";
import { LazyLoadImage } from "react-lazy-load-image-component";
import UserProfileModal from "../../../../components/userProfileModal/UserProfileModal";
import { FaPencilAlt, FaUser, FaShareAlt, FaBookmark } from "react-icons/fa";
import { format } from "date-fns";
import AuthUser from "../../../../utils/AuthUser";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TextEditor from "../../../../components/textEditor/TextEditor";
import { toast } from "react-toastify";
import { BiSolidMessageRoundedDetail, BiSolidLike } from "react-icons/bi";
import { MdReport } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { BsFillReplyFill } from "react-icons/bs";

const cx = classNames.bind(styles);

const Comment = ({
  commentId,
  avatar,
  comment,
  publishedDate,
  username,
  email,
  isEditAllowed,
  toggleReportModal,
}) => {
  const { http, accessToken, setAuthorizationHeader } = AuthUser();

  // Fetch image state
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Create a reference from a Google Cloud Storage URI
  const imageRef = ref(storage, avatar);

  const [openModal, setOpenModal] = useState(false);
  const [isModalEditCommentOpen, setIsModalEditCommentOpen] = useState(false);

  const [openModals, setOpenModals] = useState(false);

  const navigate = useNavigate();

  // Handle click out boundary of modal
  const handleOk = () => {
    setOpenModal(false);
    setOpenModals(false);
  };

  // Handle click button "X" of modal
  const handleCancel = () => {
    setOpenModals(false);
  };

  const handleClickUsername = () => {
    setOpenModal(true);
  };
  const handleNo = () => {
    setOpenModals(false);
  };
  const handleYes = () => {
    http
      .delete(`comment/delete/${commentId}`)
      .then(() => {
        Swal.fire(
          "Update!",
          "You have successfully Delete your Comment",
          "success"
        ).then(() => {
          navigate(0);
        });
      })
      .catch((reject) => {
        console.log(reject);
      });

    setOpenModals(false);
  };
  const handleDelete = () => {
    setOpenModals(true);
  };

  // // --------------------------     Handle Comment     --------------------------
  // const [content, setContent] = useState(comment);
  // const [contentError, setContentError] = useState(false);

  // const editCommentModule = {
  //   toolbar: [
  //     ["bold", "italic", "underline", "strike"], // toggled buttons
  //     ["blockquote", "code-block"],

  //     [{ list: "ordered" }, { list: "bullet" }],
  //     [{ script: "sub" }, { script: "super" }], // superscript/subscript
  //     [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

  //     [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  //     [{ header: [1, 2, 3, 4, 5, 6, false] }],

  //     [{ align: [] }],

  //     ["clean"], // remove formatting button
  //   ],
  // };

  // const handleOpenModalEditComment = () => {
  //   if (accessToken != null) {
  //     setIsModalEditCommentOpen(!isModalEditCommentOpen);
  //     setContentError(false);
  //   } else {
  //     // Lưu lại đường dẫn hiện tại
  //     const currentPath = window.location.pathname;

  //     Swal.fire({
  //       title: "Not authorized yet",
  //       text: "Please login first",
  //       icon: "info",
  //       showCancelButton: true,
  //       confirmButtonText: "Login",
  //       cancelButtonText: "Close",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         navigate("/login", {
  //           state: {
  //             from: currentPath,
  //           },
  //         });
  //       }
  //     });
  //   }
  // };

  // const handleEditComment = () => {
  //   if (!content.trim()) {
  //     setContentError(true);
  //   } else {
  //     setContentError(false);

  //     const formData = new FormData();
  //     formData.append("text", content);

  //     if (accessToken != null) {
  //       setAuthorizationHeader(accessToken);
  //     }

  //     http
  //       .put(`user/comment/update/${commentId}/`, formData)
  //       .then(() => {
  //         Swal.fire(
  //           "Ta~Da~",
  //           "You've update your comment successfully",
  //           "success"
  //         ).then(() => {
  //           navigate(0);
  //         });
  //       })
  //       .catch((reject) => {
  //         console.log(reject);
  //         toast.error("Oops. Try again", {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "colored",
  //         });
  //       });
  //   }
  // };

  // const handleCloseModalEditComment = () => {
  //   setIsModalEditCommentOpen(false);
  // };

  // const onChangeContent = (value) => {
  //   setContent(value);
  //   console.log("Comment:", value);
  // };

  // ---------------------------      Modal Draggable      ---------------------------
  const draggleRef = useRef(null);
  const [disabled] = useState(false);
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

  useEffect(() => {
    const fetchAvatar = () => {
      if (avatar != "") {
        getDownloadURL(imageRef)
          .then((resolve) => {
            setAvatarUrl(resolve);
          })
          .catch((reject) => {
            console.log(reject);
          });
      }
    };

    fetchAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx("comment-wrapper")}>
      <div className={cx("comment-wrapper__left")}>
        <div className={cx("left-top")}>
          <LazyLoadImage
            key={avatarUrl}
            src={avatarUrl}
            alt={`${avatarUrl}`}
            effect="blur"
            placeholderSrc={avatarUrl}
          />
          <p onClick={handleClickUsername} className={cx("comment-username")}>
            {username}
          </p>
        </div>
        <div className={cx("left-bottom")}></div>
      </div>
      <div className={cx("vertical-divider")}></div>
      <div className={cx("comment-wrapper__right")}>
        <div className={cx("right-top")}>
          <div className={cx("comment-published-date")}>
            <p>{format(new Date(publishedDate), "dd/MM/yyyy")}</p>
          </div>
          <div className={cx("comment-interact")}></div>
        </div>
        <div
          className={cx("right-middle")}
          dangerouslySetInnerHTML={{ __html: comment }}
        ></div>
        <div className={cx("right-bottom")}></div>
      </div>
      <Button onClick={handleDelete} type="primary" danger>
        DELETE
      </Button>

      <Modal
        title={
          <UserProfileModal
            avatar={avatarUrl}
            username={username}
            email={email}
          />
        }
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
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
        <p>Do you want to select this?</p>
        <div style={{ textAlign: "right" }}>
          <Button onClick={handleNo} style={{ marginRight: 8 }}>
            No
          </Button>
          <Button onClick={handleYes} type="primary" danger>
            Yes
          </Button>
        </div>
      </Modal>
      <Modal
        open={openModals}
        onOk={handleOk}
        onCancel={handleCancel}
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
        <h2>Do you want to select this?</h2>
        <div style={{ textAlign: "right" }}>
          <Button onClick={handleNo} style={{ marginRight: 8 }}>
            No
          </Button>
          <Button onClick={handleYes} type="primary" danger>
            Yes
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Comment;
