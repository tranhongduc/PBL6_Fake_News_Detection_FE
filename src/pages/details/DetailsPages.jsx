import React, { useRef, useState } from "react"
import styles from './DetailsPages.module.scss'
import classNames from "classnames/bind";
import { BsPencilSquare } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import { useLocation, useParams } from "react-router-dom"
import { useEffect } from "react"
import Header from "../../components/header/Header";
import AuthUser from "../../utils/AuthUser";
import { storage } from '../../utils/firebase'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { LazyLoadImage } from "react-lazy-load-image-component";
import TextEditor from "../../components/textEditor/TextEditor";
import { Form, Input, Select, Button, Modal, Pagination, Divider } from 'antd';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiErrorWarningFill } from "react-icons/ri";
import Comment from "../../components/comment/Comment";
import Footer from "../../components/footer/Footer";
import { v4 } from "uuid";
import { format } from "date-fns";

const cx = classNames.bind(styles);

const DetailsPages = () => {
  const { http, accessToken, username, setAuthorizationHeader } = AuthUser();

  const location = useLocation()
  const { isEditAllowed } = location.state

  const { id } = useParams()
  const [newsDetail, setNewsDetail] = useState({})
  const [isModalDeleteBlogOpen, setIsModalDeleteBlogOpen] = useState(false)
  const [isOnModeEditBlog, setIsOnModeEditBlog] = useState(false)
  const [isModalCreateCommentOpen, setIsModalCreateCommentOpen] = useState(false)
  const [listCategories, setListCategories] = useState([])
  const [comment, setComment] = useState('')
  const [contentError, setContentError] = useState(false);
  const [image, setImage] = useState("");
  const inputRef = useRef(null);

  const navigate = useNavigate()

  const createPostFormLayout = {
    labelCol: {
      span: 2
    },
    wrapperCol: {
      span: 22
    },
  };

  const updateNewsModule = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image', 'video', 'formula'],          // add's image support

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'] // remove formatting button
    ],
  };

  const createCommentModule = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'align': [] }],

      ['clean'] // remove formatting button
    ],
  }

  const getFirebaseImageURL = async (imagePath) => {
    const imageRef = ref(storage, imagePath);

    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error getting image URL', error);
      return null;
    }
  };

  // Pagination state
  const pageSizeOptions = [6, 9, 12];
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 9;
  const [listComments, setListComments] = useState([]); // Fetch list comments state
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [totalComments, setTotalComments] = useState(0);

  // --------------------------     Paginate     --------------------------

  const handleClickPaginate = (page, pageSize) => {
    console.log(page, pageSize);
    setCurrentPage(page);
  }

  const handleShowSizeChange = (currentPage, pageSize) => {
    console.log(currentPage, pageSize);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  // ---------------------------  Handle Upload Image ---------------------------

  const handleClickUploadImage = () => {
    inputRef.current.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    console.log(file)
    setImage(file)
  }

  // ---------------------------  Handle Delete Blog Event  ---------------------------
  const handleCloseModalDeleteBlog = () => {
    setIsModalDeleteBlogOpen(false)
  }

  const handleOpenModalDeleteBlog = () => {
    setIsModalDeleteBlogOpen(true)
  }

  const handleDeleteBlog = () => {
    if (accessToken != null) {
      setAuthorizationHeader(accessToken);
    }

    http.delete(`admin/news/delete/${id}/`)
      .then(() => {
        Swal.fire(
          'Delete Blog',
          'You\'ve deleted your blog successful',
          'success'
        ).then(() => {
          navigate('/manage-account');
        })
      })
      .catch((reject) => {
        console.log(reject);
        Swal.fire(
          'Error',
          'Oops. Try again',
          'error'
        ).then(() => {
          // navigate(0);
        })
      })
  }

  // ---------------------------  Handle Update Blog Event  ---------------------------
  const handleEditBlog = () => {
    setIsOnModeEditBlog(!isOnModeEditBlog)
  }

  // ---------------------------  Handle Update Blog Form  ---------------------------
  const [form] = Form.useForm();

  // Successful case
  const onEditBlogSuccessed = (values) => {
    // Gửi đường dẫn ảnh đến Django để lưu vào database
    // (Sử dụng API hoặc các phương thức khác để thực hiện tác vụ này)
    const selectedCategory = listCategories.find((category) => category.id === values.category)
    const categoryName = selectedCategory.name

    if (image !== "") {
      const newsRef = ref(storage, `news/${categoryName}/${image.name + v4()}/`);
      uploadBytes(newsRef, image).then(() => {
        getDownloadURL(newsRef).then((url) => {
          // Upload ảnh lên Firebase Storage
          const formData = new FormData();
          
          const { title, category, text } = values
  
          formData.append('title', title)
          formData.append('category', category)
          formData.append('text', text)
          formData.append('image', url);
  
          if (accessToken != null) {
            setAuthorizationHeader(accessToken);
          }
  
          http.put(`user/news/update/${id}/`, formData)
            .then(() => {
              Swal.fire(
                'Great!',
                'You\'ve updated your blog successfully',
                'success'
              ).then(() => {
                navigate(0);
              })
            })
            .catch((reject) => {
              console.log(reject);
  
              const { text } = reject.response.data
              if (text !== undefined) {
                toast.error(text[0], {
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
        }).catch((error) => {
          console.log('Error:', error)
          Swal.fire(
            'Oops',
            'Try again',
            'error'
          )
        })
      })
    } else {
      const { title, category, text } = values

      if (title === newsDetail.title && category === newsDetail.category_id && text === newsDetail.text) {
        Swal.fire(
          'Not updated yet',
          'You haven\'t changed anything',
          'error'
        )
      } else {
        const formData = new FormData();
  
        formData.append('title', title)
        formData.append('category', category)
        formData.append('text', text)
    
        if (accessToken != null) {
          setAuthorizationHeader(accessToken);
        }
    
        http.put(`user/news/update/${id}/`, formData)
          .then(() => {
            Swal.fire(
              'Great',
              'You\'ve updated your blog successfully',
              'success'
            ).then(() => {
              navigate(0);
            })
          })
          .catch((reject) => {
            console.log(reject);

            const { text } = reject.response.data
            if (text !== undefined) {
              toast.error(text[0], {
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
              Swal.fire(
                'Oops',
                'Try again',
                'error'
              )
            }
          })
      }
    }
  }

  // Failed case
  const onEditBlogFailed = (error) => {
    console.log('Error:', error)
    toast.error('Please input all fields', {
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

  // --------------------------     Handle Comment     --------------------------
  const handleCloseModalCreateComment = () => {
    setIsModalCreateCommentOpen(false)
  }

  const handleOpenModalCreateComment = () => {
    if (accessToken != null) {
      setIsModalCreateCommentOpen(!isModalCreateCommentOpen)
      setContentError(false);
    } else {
      // Lưu lại đường dẫn hiện tại
      const currentPath = window.location.pathname;

      Swal.fire({
        title: 'Not authorized yet',
        text: 'Please login first',
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
    }
  }

  const onChangeComment = (value) => {
    setComment(value)
    console.log('Comment:', value)
  }

  const handleCreateComment = () => {
    if (!comment.trim()) {
      setContentError(true);
    } else {
      setContentError(false);

      const formData = new FormData();
      formData.append('text', comment);
      formData.append('news', id);

      if (accessToken != null) {
        setAuthorizationHeader(accessToken);
      }

      http.post(`user/comment/store/`, formData)
        .then(() => {
          Swal.fire(
            'Ta~Da~',
            'You\'ve create your comment successfully',
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

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    const fetchData = () => {
      http.get('admin/categories_list')
        .then((resolve) => {
          console.log('Response Data:', resolve.data)
          setListCategories(resolve.data.categories)
        })
        .catch((reject) => {
          console.log('Error:', reject)
        })
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await http.get(`/admin/detail-news/${id}`);
        console.log('Detail:', response)
        const newsDetail = response.data;

        // Update image URL
        const imageUrl = await getFirebaseImageURL(newsDetail.image);
        newsDetail.imageUrl = imageUrl;

        setNewsDetail(newsDetail);
        setTotalComments(newsDetail.comments_count)
      } catch (error) {
        console.log('Error:', error)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    const fetchData = () => {
      http.get(`admin/comments_list_by_news/${id}/${currentPage}`)
        .then((resolve) => {
          console.log('List Comments:', resolve.data)
          const listComments = resolve.data.comments
          setListComments(listComments);
        })
        .catch((reject) => {
          console.log('Error:', reject);
        });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  return (
    <div className={cx("details-container")}>
      <Header />
      <div className={cx("details-blog")}>
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <div className={cx("details-blog__top")}>
          {image ? (
            <>
              <p>{image.name}</p>
              <img style={{objectFit: 'cover'}} src={URL.createObjectURL(image)} alt='blogImage' className={cx("scaled-img")} />
            </>
          ) : (
            <LazyLoadImage
              key={newsDetail.id}
              src={newsDetail.imageUrl}
              alt={`Blog ${newsDetail.id}`}
              effect="blur"
              width={'100%'}
              height={700}
              className={cx("scaled-img")}
            />
          )}
        </div>
        <div className={cx("details-blog__bottom")}>
          {isEditAllowed ? (
            <div className={cx("btn-container")}>
              <button
                onClick={handleEditBlog}
                className={cx("btn-edit")}
              >
                <BsPencilSquare size={18} />
              </button>
              <button
                onClick={handleOpenModalDeleteBlog}
                className={cx("btn-delete")}
              >
                <AiOutlineDelete size={18} />
              </button>
            </div>
          ) : (
            <></>
          )}
          {isOnModeEditBlog ? (
            <div className={cx("form-container")}>
              <div className={cx("btn-image-container")}>
                <button onClick={handleClickUploadImage} className={cx("btn-upload-image")}>
                  Upload Image
                </button>
              </div>
              <Form
                {...createPostFormLayout}
                form={form}
                layout='horizontal'
                name='edit_blog_form'
                labelAlign='right'
                labelWrap='true'
                size='large'
                autoComplete="off"
                onFinish={onEditBlogSuccessed}
                onFinishFailed={onEditBlogFailed}
                initialValues={{
                  'title': newsDetail.title,
                  'category': newsDetail.category_id,
                  'text': newsDetail.text
                }}
              >
                <Form.Item
                  name='title'
                  label="Title"
                  rules={[
                    {
                      required: true,
                      message: 'Title of news is required!'
                    },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Your blog's title" />
                </Form.Item>
                <Form.Item
                  name="category"
                  label="Category"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Category is required!',
                    },
                  ]}
                >
                  <Select className={cx("categories-options")} placeholder="Select your blog's category">
                    {
                      listCategories.map((category) => {
                        return (
                          <Select.Option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </Select.Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  name="text"
                  label="Content"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Content is required!',
                    },
                  ]}
                >
                  <TextEditor
                    modules={updateNewsModule}
                    value={newsDetail.text}
                    placeholder={"Your Blog's Content"}
                  />
                </Form.Item>
                <Form.Item
                  wrapperCol={24}
                >
                  <div className={cx("btn-submit-container")}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={cx("btn-submit")}
                    >
                      Update Blog
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          ) : (
            <>
              <div className={cx("details-blog-header")}>
                <h1 className={cx("details-blog-header__top")}>{newsDetail.title}</h1>
                <div className={cx("details-blog-header__bottom")}>
                  <p>Author: <span className={cx("author")}>{newsDetail.author}</span></p>
                  <p className={cx("published_date")}>
                    {newsDetail.created_at ? (
                      <p>Published date: {format(new Date(newsDetail.created_at), 'dd/MM/yyyy')}</p>
                    ) : (
                      <></>
                    )}
                  </p>
                </div>
              </div>
              <p className={cx("details-blog__content")} dangerouslySetInnerHTML={{ __html: newsDetail.text }}></p>

              <div className={cx("review-wrapper")}>
                <div className={cx("review-wrapper__left")}>
                  <h2>Comments</h2>
                </div>
                <div className={cx("review-wrapper__right")}>
                  <button onClick={handleOpenModalCreateComment}>
                    Create comment
                  </button>
                </div>
              </div>
              <div className={cx("comment")}>
                {listComments.map((comment, index) => {
                  if (index === listComments.length - 1) {
                    return (
                      <Comment
                        commentId={comment.id}
                        avatar={comment.avatar}
                        comment={comment.text}
                        publishedDate={comment.created_at}
                        username={comment.author}
                        email={comment.email}
                        isEditAllowed={comment.author === username ? true : false}
                      />
                    )
                  } else {
                    return (
                      <>
                        <Comment
                          key={comment.id}
                          commentId={comment.id}
                          avatar={comment.avatar}
                          comment={comment.text}
                          publishedDate={comment.created_at}
                          username={comment.author}
                          email={comment.email}
                          isEditAllowed={comment.author === username ? true : false}
                        />
                        <Divider className={cx("seperate-line")} />
                      </>
                    )
                  }
                })}
                <div className={cx("pagination")}>
                  <Pagination
                    current={currentPage}
                    defaultCurrent={DEFAULT_CURRENT_PAGE_NUMBER}
                    defaultPageSize={DEFAULT_PAGE_SIZE_NUMBER}
                    hideOnSinglePage
                    total={totalComments}
                    pageSizeOptions={pageSizeOptions}
                    showTotal={(totalComments) => totalComments <= 1 ? `Total ${totalComments} comment` : `Total ${totalComments} comments`}
                    showQuickJumper
                    showSizeChanger
                    onChange={handleClickPaginate}
                    onShowSizeChange={handleShowSizeChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Modal Delete Blog */}
      <Modal
        title="Delete Blog"
        open={isModalDeleteBlogOpen}
        onOk={handleDeleteBlog}
        onCancel={handleCloseModalDeleteBlog}
        footer={[
          <>
            <Button
              type="primary"
              className={cx("btn-confirm-delete")}
              key="delete"
            >
              OK
            </Button>
            <Button
              type="primary"
              className={cx("btn-cancel-delete")}
              key="back"
              onClick={handleCloseModalDeleteBlog}
            >
              Cancel
            </Button>
          </>
        ]}
      >
        <div className={cx("modal-wrapper-delete")}>
          <RiErrorWarningFill size={30} style={{ color: '#ED5253' }} />
          <h2 style={{ textAlign: 'center' }}>Confirm delete this blog?</h2>
        </div>
      </Modal>
      {/* Create Comment */}
      <Modal
        title="Create Comment"
        open={isModalCreateCommentOpen}
        onOk={handleCreateComment}
        onCancel={handleCloseModalCreateComment}
        footer={[
          <>
            <Button
              type="primary"
              key="create"
              onClick={handleCreateComment}
            >
              Create
            </Button>
            <Button
              type="primary"
              className={cx("btn-cancel-delete")}
              key="back"
              onClick={handleCloseModalCreateComment}
            >
              Cancel
            </Button>
          </>
        ]}
      >
        <div className={cx("modal-wrapper")}>
          <TextEditor
            modules={createCommentModule}
            value={comment}
            placeholder={"Write your comment"}
            onChange={onChangeComment}
          />
          {contentError && (
            <div className={cx("error-message")}>
              Content is required
            </div>
          )}
        </div>
      </Modal>
      <Footer />
    </div>
  )
}

export default DetailsPages