import React, { useState } from "react"
import styles from './DetailsPages.module.scss'
import classNames from "classnames/bind";
import { BsPencilSquare } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import { useLocation, useParams } from "react-router-dom"
import { useEffect } from "react"
import Header from "../../components/header/Header";
import AuthUser from "../../utils/AuthUser";
import { storage } from '../../utils/firebase'
import { ref, getDownloadURL } from "firebase/storage"
import { LazyLoadImage } from "react-lazy-load-image-component";
import TextEditor from "../../components/textEditor/TextEditor";
import { Form, Input, Select, Button, Modal, Pagination, Divider } from 'antd';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiErrorWarningFill } from "react-icons/ri";
import Comment from "../../components/comment/Comment";
import Footer from "../../components/footer/Footer";

const cx = classNames.bind(styles);

const DetailsPages = () => {
  const { http, accessToken, setAuthorizationHeader } = AuthUser();

  const location = useLocation()
  const { isEditAllowed } = location.state

  const { id } = useParams()
  const [newsDetail, setNewsDetail] = useState({})
  const [isModalDeleteBlogOpen, setIsModalDeleteBlogOpen] = useState(false)
  const [isOnModeEditBlog, setIsOnModeEditBlog] = useState(false)
  const [listCategories, setListCategories] = useState([])

  const navigate = useNavigate()

  const createPostFormLayout = {
    labelCol: {
      span: 2
    },
    wrapperCol: {
      span: 22
    },
  };

  const getFirebaseImageURL = async (imagePath) => {
    const imageRef = ref(storage, imagePath);

    try {
      const url = await getDownloadURL(imageRef);
      console.log('Url:', url)
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

  // ---------------------------  Handle Delete Blog Event  ---------------------------
  const handleOk = () => {
    setIsModalDeleteBlogOpen(false)
  }

  const handleCancel = () => {
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
    const { title, category, text } = values
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
          'Ta~Da~',
          'You\'ve updated your blog successfully',
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

  // --------------------------     Fetch API     --------------------------

  return (
    <div className={cx("details-container")}>
      <Header />
      <div className={cx("details-blog")}>
        <div className={cx("details-blog__top")}>
          <LazyLoadImage
            key={newsDetail.id}
            src={newsDetail.imageUrl}
            alt={`Blog ${newsDetail.id}`}
            effect="blur"
            width={'100%'}
            height={700}
            className={cx("scaled-img")}
          />
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
                    value={newsDetail.text}
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
              <h1 className={cx("details-blog__title")}>{newsDetail.title}</h1>
              <p className={cx("details-blog__content")} dangerouslySetInnerHTML={{ __html: newsDetail.text }}></p>

              <div className={cx("review-wrapper")}>
                <div className={cx("review-wrapper__left")}>
                  <h2>Comments</h2>
                </div>
                <div className={cx("review-wrapper__right")}>
                  <button>
                    Create comment
                  </button>
                </div>
              </div>
              <div className={cx("comment")}>
                {listComments.map((comment, index) => {
                  if (index === listComments.length - 1) {
                    return (
                      <Comment
                        avatar={comment.avatar}
                        comment={comment.text}
                        username={comment.author}
                        email={comment.email}
                      />
                    )
                  } else {
                    return (
                      <>
                        <Comment
                          key={comment.id}
                          avatar={comment.avatar}
                          comment={comment.text}
                          username={comment.author}
                          email={comment.email}
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
      <Modal
        title="Xoá bài viết"
        open={isModalDeleteBlogOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <>
            <Button
              type="primary"
              className={cx("btn-confirm-delete")}
              key="delete"
              onClick={handleDeleteBlog}
            >
              OK
            </Button>
            <Button
              type="primary"
              className={cx("btn-cancel-delete")}
              key="back"
              onClick={handleCancel}
            >
              Huỷ
            </Button>
          </>
        ]}
      >
        <div className={cx("modal-wrapper")}>
          <RiErrorWarningFill size={30} style={{ color: '#ED5253' }} />
          <h2 style={{ textAlign: 'center' }}>Xác nhận xoá bài viết này?</h2>
        </div>
      </Modal>
      <Footer />
    </div>
  )
}

export default DetailsPages