import React, { useState, useEffect, useRef } from "react";
import styles from "./Comment.module.scss";
import classNames from "classnames/bind";
import { BsFlagFill } from "react-icons/bs";
import { Button, Modal, Tooltip } from "antd";
import { ref, getDownloadURL } from "firebase/storage"
import { storage } from '../../utils/firebase'
import Draggable from "react-draggable";
import { LazyLoadImage } from "react-lazy-load-image-component";
import UserProfileModal from "../userProfileModal/UserProfileModal";
import { FaPencilAlt, FaUser, FaShareAlt, FaBookmark } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import AuthUser from "../../utils/AuthUser";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import TextEditor from "../textEditor/TextEditor";
import { toast } from "react-toastify";
import { BiSolidMessageRoundedDetail, BiSolidLike } from "react-icons/bi";
import { MdReport } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { BsFillReplyFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";

const cx = classNames.bind(styles);

const Comment = ({ 
  newsId, 
  commentId, 
  accountAvatar, 
  joinDate, 
  commentCount, 
  totalLike, 
  comment, 
  publishedDate, 
  accountUsername, 
  email, 
  isEditAllowed, 
  toggleReportModal, 
  isOpenReply, 
  setOpenReply, 
}) => {

  const { http, accessToken, avatar, username, setAuthorizationHeader } = AuthUser()

  // Fetch image state
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Create a reference from a Google Cloud Storage URI
  const imageRef = ref(storage, accountAvatar);

  const [openModal, setOpenModal] = useState(false);
  const [isModalEditCommentOpen, setIsModalEditCommentOpen] = useState(false)
  const [reply, setReply] = useState('')
  const [isOnModePreview, setOnModePreview] = useState(false);

  const navigate = useNavigate();

  // Handle click out boundary of modal
  const handleOk = () => {
    setOpenModal(false);
  };

  // Handle click button "X" of modal
  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleClickUsername = () => {
    setOpenModal(true);
  };

  const createReplyModule = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image', 'video', 'formula'],          // add's image support

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'] // remove formatting button
    ],
  }

  // --------------------------     Handle Comment     --------------------------
  const [content, setContent] = useState(comment);
  const [contentError, setContentError] = useState(false);

  const editCommentModule = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  };

  const handleOpenModalEditComment = () => {
    if (accessToken != null) {
      setIsModalEditCommentOpen(!isModalEditCommentOpen);
      setContentError(false);
    } else {
      // Lưu lại đường dẫn hiện tại
      const currentPath = window.location.pathname;

      Swal.fire({
        title: "Not authorized yet",
        text: "Please login first",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', {
            state: {
              from: currentPath,
            }
          });
        }
      })
    }
  };

  const handleEditComment = () => {
    if (!content.trim()) {
      setContentError(true);
    } else {
      setContentError(false);

      const formData = new FormData();
      formData.append('text', content);

      if (accessToken != null) {
        setAuthorizationHeader(accessToken);
      }

      http.put(`user/comment/update/${commentId}/`, formData)
        .then(() => {
          Swal.fire(
            "Ta~Da~",
            "You've update your comment successfully",
            "success"
          ).then(() => {
            navigate(0);
          });
        })
        .catch((reject) => {
          console.log(reject);
          toast.error("Oops. Try again", {
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
    }
  };

  const handleCloseModalEditComment = () => {
    setIsModalEditCommentOpen(false);
  };

  const onChangeContent = (value) => {
    setContent(value);
    console.log("Comment:", value);
  };

  // --------------------------     Handle Comment     --------------------------
  const handleAuthorized = () => {
    // Lưu lại đường dẫn hiện tại
    const currentPath = window.location.pathname;

    navigate('/login', {
      state: {
        from: currentPath,
      }
    });
  }

  const handlePostReply = () => {
    if (!comment.trim()) {
      setContentError(true);
    } else {
      setContentError(false);

      const formData = new FormData();
      formData.append('text', comment);
      formData.append('news', newsId);

      if (accessToken != null) {
        setAuthorizationHeader(accessToken);
      }

      http.post(`user/comment/store/`, formData)
        .then(() => {
          Swal.fire(
            'Ta~Da~',
            'You\'ve post your comment successfully',
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
  }

  const handleReply = () => {
    if (isOpenReply) {
      const replyWrapper = document.querySelector('.Comment_comment-reply__JpPso');

      // Thêm lớp close ngay khi đóng modal
      replyWrapper.classList.add(styles.closereply);

      setTimeout(() => {
        setOpenReply(false);
      }, 400)
    } else {
      setOpenReply(true);
    }
  }

  const handlePreviewReply = () => {
    if (reply.trim() !== "") {
      setContentError(false)
    }

    if (isOnModePreview) {
      const previewReply = document.querySelector('.Comment_preview-reply__wEGWO');

      // Thêm lớp close ngay khi đóng modal
      previewReply.classList.add(styles.closepreview);

      setTimeout(() => {
        setOnModePreview(false);
      }, 400)
    } else {
      setOnModePreview(true);
    }
  }

  const onChangeReply = (value) => {
    setReply(value)
    console.log('Reply:', value)
  }

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
    <div className={cx("comment-container")}>
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
            <p onClick={handleClickUsername} className={cx("comment-username")}>{accountUsername}</p>
          </div>
          <div className={cx("left-bottom")}>
            <div className={cx("left-bottom__date")}>
              <Tooltip title="Joined Date">
                <FaUser />
              </Tooltip>
              <p>{format(parseISO(joinDate), 'MMM dd, yyyy')}</p>
            </div>
            <div className={cx("left-bottom__message")}>
              <Tooltip title="Total Comment">
                <BiSolidMessageRoundedDetail />
              </Tooltip>
              <p>{commentCount}</p>
            </div>
            <div className={cx("left-bottom__like")}>
              <Tooltip title="Total Like">
                <BiSolidLike />
              </Tooltip>
              <p>{totalLike}</p>
            </div>
          </div>
        </div>
        <div className={cx("vertical-divider")}></div>
        <div className={cx("comment-wrapper__right")}>
          <div className={cx("right-top")}>
            <div className={cx("comment-published-date")}>
              <Tooltip title="Post Date">
                <p>{format(parseISO(publishedDate), 'MMM dd, yyyy')}</p>
              </Tooltip>
            </div>
            <div className={cx("comment-interact")}>
              <FaShareAlt className={cx("comment-interact__share")} />
              <FaBookmark className={cx("comment-interact__bookmark")} />
              <p onClick={handleClickUsername} className={cx("comment-interact__number")}>{accountUsername}</p>
            </div>
          </div>
          <div className={cx("right-middle")} dangerouslySetInnerHTML={{ __html: comment }} />
          <div className={cx("right-bottom")}>
            <div onClick={toggleReportModal} className={cx("right-bottom__left")}>
              <MdReport className={cx("report-icon")} />
              <p className={cx("report-text")}>Report</p>
            </div>
            <div className={cx("right-bottom__right")}>
              <div className={cx("bottom-right__like")}>
                <AiFillLike />
                <p className={cx("like-text")}>Like</p>
              </div>
              <div onClick={handleReply} className={cx("bottom-right__reply")}>
                <BsFillReplyFill />
                <p className={cx("reply-text")}>Reply</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenReply ? (
        <div className={cx("comment-reply")}>
          <div className={cx("comment-reply__left")}>
            <img src={avatar} alt={`${avatar}`} />
            <p className={cx("comment-username")}>{username}</p>
          </div>
          <div className={cx("vertical-divider")} />
          <div className={cx("comment-reply__right")}>
            <div className={cx("right-editor")}>
              <TextEditor
                modules={createReplyModule}
                value={reply}
                placeholder={"Write your reply"}
                onChange={onChangeReply}
              />
              {contentError && (
                <div className={cx("error-message")}>
                  <p>Content is required</p>
                </div>
              )}
            </div>
            {isOnModePreview ? (
              <div className={cx("preview-reply")}>
                <p>Preview</p>
                <div className={cx("preview-content")} dangerouslySetInnerHTML={{ __html: reply }} />
              </div>
            ) : (
              <></>
            )}
            <div className={cx("right-bottom-editor")}>
              <button className={cx("btn-reply")} onClick={handlePostReply}>
                <BsFillReplyFill size={16} />
                <p>REPLY</p>
              </button>
              <button className={cx("btn-preview")} onClick={handlePreviewReply}>
                <FaEye size={16} />
                <p>PREVIEW</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* User Profile */}
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
      />
      {/* Create Comment */}
      <Modal
        title="Edit Comment"
        open={isModalEditCommentOpen}
        onOk={handleEditComment}
        onCancel={handleCloseModalEditComment}
        footer={[
          <>
            <Button type="primary" key="edit" onClick={handleEditComment}>
              Update
            </Button>
            <Button
              type="primary"
              key="back"
              className={cx("btn-cancel-delete")}
              onClick={handleCloseModalEditComment}
            >
              Cancel
            </Button>
          </>,
        ]}
      >
        <div className={cx("modal-wrapper")}>
          <TextEditor
            modules={editCommentModule}
            value={content}
            placeholder={"Write your comment"}
            onChange={onChangeContent}
          />
          {contentError && (
            <div className={cx("error-message")}>Content is required</div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Comment;
