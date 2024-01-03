import React, { useState, useRef } from "react";
import styles from "./Comment.module.scss";
import classNames from "classnames/bind";
import { Modal, Tooltip } from "antd";
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
import { MdReport, MdDelete } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { BsFillReplyFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import Reply from "../reply/Reply";
import { ImReply } from "react-icons/im";
import { IoCloseSharp } from "react-icons/io5";

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
  toggleReportModal, 
  isOpenReply, 
  setOpenReply, 
}) => {

  const { http, accessToken, avatar, userId, username, setAuthorizationHeader } = AuthUser()

  const [openModal, setOpenModal] = useState(false);
  const [isOnModePreviewReply, setOnModePreviewReply] = useState(false);
  const [isOnModePreviewEdit, setOnModePreviewEdit] = useState(false);
  const [isOpenListReplies, setOpenListReplies] = useState(false)
  const [isOpenCommentEditor, setOpenCommentEditor] = useState(false)

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
  const [content, setContent] = useState(() => comment);
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

  const toggleCommentEditor = () => {
    if (accessToken != null) {
      setOpenCommentEditor(!isOpenCommentEditor);
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
  }

  const handlePreviewEditComment = () => {
    if (content.trim() !== "") {
      setContentError(false)
    }

    if (isOnModePreviewEdit) {
      const previewWrapper = document.querySelector('.Comment_preview-reply__wEGWO');

      // Thêm lớp close ngay khi đóng modal
      previewWrapper.classList.add(styles.closepreview);

      setTimeout(() => {
        setOnModePreviewEdit(false);
      }, 400)
    } else {
      setOnModePreviewEdit(true);
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
            "You've updated your comment successfully",
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

  const handleDeleteComment = () => {
    if (accessToken != null) {
      Swal.fire({
        title: "HOLD UP!",
        html: "Are you sure you want to delete this comment?<br>After deleting, you can't recover anymore!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        focusCancel: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setAuthorizationHeader(accessToken)

          http.delete(`admin/comment/delete/${commentId}/`)
            .then(() => {
              Swal.fire(
                "Done",
                "You've deleted your comment successfully",
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
      })
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

  const handleOpenViewReplies = () => {
    if (isOpenListReplies) {
      const viewRepliesWrapper = document.querySelector('.Comment_view-reply-container__5xGsv');

      // Thêm lớp close ngay khi đóng modal
      viewRepliesWrapper.classList.add(styles.closepreview);

      setTimeout(() => {
        setOpenListReplies(false);
      }, 400)
    } else {
      setOpenListReplies(true);
    }
  }

  const handlePostReply = () => {
    if (!reply.trim()) {
      setRelpyError(true);
    } else {
      setRelpyError(false);

      const formData = new FormData();
      formData.append('text', reply);
      formData.append('news', newsId);
      formData.append('parent_comment_id', commentId);

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

    if (isOnModePreviewReply) {
      const previewReply = document.querySelector('.Comment_preview-reply__wEGWO');

      // Thêm lớp close ngay khi đóng modal
      previewReply.classList.add(styles.closepreview);

      setTimeout(() => {
        setOnModePreviewReply(false);
      }, 400)
    } else {
      setOnModePreviewReply(true);
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
            {isOpenCommentEditor ? (
              <div className={cx("comment-edit")}>
                <TextEditor
                  modules={editCommentModule}
                  value={content}
                  placeholder={"Edit your comment"}
                  onChange={onChangeContent}
                />
                {contentError && (
                  <div className={cx("error-message")}>
                    <p>Content is required</p>
                  </div>
                )}
                {isOnModePreviewEdit && (
                  <div className={cx("preview-reply")}>
                    <p>Preview</p>
                    <div className={cx("preview-content")} dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                )}
                <div className={cx("comment-edit__bottom")}>
                  <button className={cx("btn-edit")} onClick={handleEditComment}>
                    <FaEdit size={16} />
                    <p>CONFIRM</p>
                  </button>
                  <button className={cx("btn-preview")} onClick={handlePreviewEditComment}>
                    <FaEye size={16} />
                    <p>PREVIEW</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className={cx("comment-content")} dangerouslySetInnerHTML={{ __html: comment }} />
            )}
            {/* Show Nested List Comments */}
            {(subCommentCount > 0) && (
              <>
                <div className={cx("view-replies")}>
                  <ImReply className={cx("icon-reply")} />
                  <p onClick={handleOpenViewReplies}>{subCommentCount == 1 ? `${subCommentCount} Reply` : `${subCommentCount} Replies`}</p>
                </div>
                {isOpenListReplies && (
                  <div className={cx("view-reply-container")}>
                    {listSubComment.map((subComment) => {
                      console.log('Sub comment:', subComment )
                      return (
                        <Reply
                          newsId={newsId}
                          commentId={subComment.id}
                          authorId={subComment.author_id}
                          accountAvatar={subComment.avatar_url}
                          comment={subComment.text}
                          accountUsername={subComment.author}
                          joinDate={subComment.join_date}
                          publishedDate={subComment.created_at}
                          toggleReportModal={toggleReportModal}
                        />
                      )
                    })}
                  </div>
                )}
              </>
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
                <div onClick={toggleCommentEditor} className={cx("left-edit")}>
                  <FaEdit className={cx("edit-icon")} />
                  <p className={cx("edit-text")}>{isOpenCommentEditor ? 'Close Edit' : 'Edit Comment'}</p>
                </div>
                <div onClick={handleDeleteComment} className={cx("left-delete")}>
                  <MdDelete size={18} className={cx("delete-icon")} />
                  <p className={cx("delete-text")}>Delete Comment</p>
                </div>
              </div>
            )}
            <div className={cx("right-bottom__right")}>
              <div onClick={handleLikeComment} className={cx("bottom-right__like")}>
                <AiFillLike />
                <p className={cx("like-text")}>Like</p>
              </div>
              <div onClick={handleOpenReply} className={cx("bottom-right__reply")}>
                <BsFillReplyFill />
                <p className={cx("reply-text")}>{isOpenReply ? 'Close Reply' : 'Reply'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenReply && (
        <div className={cx("comment-reply")}>
          <div className={cx("comment-reply__left")}>
            <img src={avatar} alt={`${avatar}`} />
            <p className={cx("comment-username")}>{username}</p>
          </div>
          <div className={cx("vertical-divider")} />
          <div className={cx("comment-reply__right")}>
            <div className={cx("right-close")}>
              <IoCloseSharp onClick={handleOpenReply} size={20} className={cx("icon-close")} />
            </div>
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
            {isOnModePreviewReply && (
              <div className={cx("preview-reply")}>
                <p>Preview</p>
                <div className={cx("preview-content")} dangerouslySetInnerHTML={{ __html: reply }} />
              </div>
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
    </div>
  );
};

export default Comment;
