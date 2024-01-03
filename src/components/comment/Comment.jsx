import React, { useState, useRef } from "react";
import styles from "./Comment.module.scss";
import classNames from "classnames/bind";
import { Button, Modal, Tooltip } from "antd";
import Draggable from "react-draggable";
import { LazyLoadImage } from "react-lazy-load-image-component";
import UserProfileModal from "../userProfileModal/UserProfileModal";
import { FaEdit, FaUser, FaShareAlt, FaBookmark } from "react-icons/fa";
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
import Reply from "../reply/Reply";
import { ImReply } from "react-icons/im";

const cx = classNames.bind(styles);

const Comment = ({ 
  numericalOrder,
  newsId, 
  authorId,
  commentId, 
  accountAvatar, 
  joinDate, 
  comment, 
  listSubComment,
  subCommentCount,
  publishedDate, 
  accountUsername, 
  email, 
  commentCount, 
  totalLike, 
  isEditAllowed, 
  toggleReportModal, 
  isOpenReply, 
  setOpenReply, 
}) => {

  const { http, accessToken, avatar, userId, username, setAuthorizationHeader } = AuthUser()

  const [openModal, setOpenModal] = useState(false);
  const [isModalEditCommentOpen, setIsModalEditCommentOpen] = useState(false)
  const [isOnModePreview, setOnModePreview] = useState(false);
  const [isOpenListReplies, setOpenListReplies] = useState([])

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
  const [reply, setReply] = useState('')
  const [replyError, setRelpyError] = useState(false);

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
            "Great",
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

  // --------------------------     Handle Reply     --------------------------
  const handleOpenReply = () => {
    if (accessToken === null) {
      // Lưu lại đường dẫn hiện tại
      const currentPath = window.location.pathname;

      Swal.fire({
        title: 'Not authorized yet',
        text: 'Please login to post reply',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Close',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { 
            state: { 
              from: currentPath,
            } 
          });
        } 
      })
    } else {
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
  }

  const handleViewReplies = () => {
    // if (isOpenReply) {
    //   const replyWrapper = document.querySelector('.Comment_comment-reply__JpPso');

    //   // Thêm lớp close ngay khi đóng modal
    //   replyWrapper.classList.add(styles.closereply);

    //   setTimeout(() => {
    //     setOpenReply(false);
    //   }, 400)
    // } else {
    //   setOpenReply(true);
    // }
  }

  const handlePostReply = () => {
    if (!reply.trim()) {
      setRelpyError(true);
    } else {
      setRelpyError(false);

      const formData = new FormData();
      formData.append('text', reply);
      formData.append('news', newsId);

      if (accessToken != null) {
        setAuthorizationHeader(accessToken);
      }

      http.post(`user/comment/store/`, formData)
        .then(() => {
          Swal.fire(
            'Great',
            'You\'ve post your reply successfully',
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

  const handlePreviewReply = () => {
    if (reply.trim() !== "") {
      setRelpyError(false)
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

  // --------------------------     Handle Like Comment     --------------------------
  const handleLikeComment = () => {
    if (accessToken === null) {
      // Lưu lại đường dẫn hiện tại
      const currentPath = window.location.pathname;

      Swal.fire({
        title: 'Not authorized yet',
        text: 'Please login to leave a like',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Close',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { 
            state: { 
              from: currentPath,
            } 
          });
        } 
      })
    } else {

    }
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

  return (
    <div className={cx("comment-container")}>
      <div className={cx("comment-wrapper")}>
        <div className={cx("comment-wrapper__left")}>
          <div className={cx("left-top")}>
            <LazyLoadImage
              key={accountAvatar}
              src={accountAvatar}
              alt={`${accountAvatar}`}
              effect="blur"
              placeholderSrc={accountAvatar}
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
              <p className={cx("comment-interact__number")}>{`#${numericalOrder}`}</p>
            </div>
          </div>
          <div className={cx("right-middle")}>
            <div className={cx("comment-content")} dangerouslySetInnerHTML={{ __html: comment }} />
            {(subCommentCount > 0) ? (
              <>
                <div onClick={handleViewReplies} className={cx("view-replies")}>
                  <ImReply className={cx("icon-reply")} />
                  <p>{subCommentCount == 1 ? `${subCommentCount} Reply` : `${subCommentCount} Replies`}</p>
                </div>
                <div className={cx("view-reply-container")}>
                  {listSubComment.map((subComment, index) => {
                    return (
                      <Reply
                        newsId={newsId}
                        commentId={commentId}
                        accountAvatar={subComment.avatar}
                        comment={subComment.text}
                        accountUsername={subComment.author}
                        joinDate={subComment.join_date}
                        publishedDate={subComment.created_at}
                        toggleReportModal={toggleReportModal}
                      />
                    )
                  })}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className={cx("right-bottom")}>
            {(userId !== authorId) ? (
              <div onClick={toggleReportModal} className={cx("right-bottom__left")}>
                <MdReport className={cx("report-icon")} />
                <p className={cx("report-text")}>Report</p>
              </div>
            ) : (
              <div className={cx("right-bottom__left")}>
                <FaEdit className={cx("edit-icon")} />
                <p className={cx("edit-text")}>Edit Comment</p>
              </div>
            )}
            <div className={cx("right-bottom__right")}>
              <div onClick={handleLikeComment} className={cx("bottom-right__like")}>
                <AiFillLike />
                <p className={cx("like-text")}>Like</p>
              </div>
              <div onClick={handleOpenReply} className={cx("bottom-right__reply")}>
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
              {replyError && (
                <div className={cx("error-message")}>
                  <p>Reply content is required</p>
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
            avatar={accountAvatar}
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
