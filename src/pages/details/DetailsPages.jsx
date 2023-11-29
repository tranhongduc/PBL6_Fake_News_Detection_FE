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
import { Form, Input, Select, Button, Modal } from 'antd';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiErrorWarningFill } from "react-icons/ri";

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
  const [blogContent, setBlogContent] = useState('')

  const navigate = useNavigate()

  const createPostFormLayout = {
    labelCol: {
      span: 2
    },
    wrapperCol: {
      span: 22
    },
  };

  const getFirebaseImageURL = async (imagePath, newsId) => {
    const imageRef = ref(storage, imagePath);

    try {
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error('Error getting image URL', error);
      return null;
    }
  };

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
  }

  // ---------------------------  Handle Update Blog Event  ---------------------------
  const handleEditBlog = () => {
    setIsOnModeEditBlog(!isOnModeEditBlog)
    console.log('HELLO')
  }

  const handleChangeBlog = (e) => {
    setBlogContent(e)
  }

  // ---------------------------  Handle Update Blog Form  ---------------------------
  const [form] = Form.useForm();

  // Successful case
  const onEditBlogSuccessed = (values) => {
    const { title, category, text } = values
    const formData = new FormData();

    console.log('Text', text)

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
          'You\'ve update your blog successfully',
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
    const fetchData = async () => {
      try {
        const response = await http.get(`/admin/detail-news/${id}`);
        const newsDetail = response.data;

        // Update image URL
        const imageUrl = await getFirebaseImageURL(newsDetail.image);
        newsDetail.imageUrl = imageUrl;

        setNewsDetail(newsDetail);
      } catch (error) {
        console.log('Error:', error)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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
                  'category': newsDetail.category,
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
                    onChange={handleChangeBlog}
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
          <RiErrorWarningFill size={30} style={{color: '#ED5253'}} />
          <h2 style={{textAlign: 'center'}}>Xác nhận xoá bài viết này?</h2>
        </div>
      </Modal>
    </div>
  )
}

export default DetailsPages