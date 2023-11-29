import React, { useState, useEffect, useRef } from "react"
import styles from './Create.module.scss'
import classNames from "classnames/bind";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import img from "../../assets/images/b11.jpeg"
import { Form, Input, Select, Button } from 'antd';
import AuthUser from "../../utils/AuthUser";
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css'
import TextEditor from "../textEditor/TextEditor";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Create = () => {
  const { http, accessToken, setAuthorizationHeader } = AuthUser();
  const inputRef = useRef(null);
  const [image, setImage] = useState("");
  const [value, setValue] = useState('')
  const [listCategories, setListCategories] = useState([])

  const createPostFormLayout = {
    labelCol: {
      span: 2
    },
    wrapperCol: {
      span: 22
    },
  };

  const navigate = useNavigate();

  // ---------------------------  Handle Upload Image ---------------------------

  const handleClickUploadImage = () => {
    inputRef.current.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    console.log(file)
    setImage(file)
  }

  // ---------------------------  Set field for date input  ---------------------------
  const [form] = Form.useForm();

  // Successful case
  const onCreatePostSuccessed = (values) => {
    const { title, category, text } = values
    const formData = new FormData();

    formData.append('title', title)
    formData.append('category', category)
    formData.append('text', text)

    if (accessToken != null) {
      setAuthorizationHeader(accessToken);
    }

    http.post('user/news/store/', formData)
      .then(() => {
        Swal.fire(
          'Ta~Da~',
          'You\'ve create new post successfully',
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
  const onCreatePostFailed = (error) => {
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
    if (accessToken != null) {
      setAuthorizationHeader(accessToken);
    }

    const fetchData = () => {
      http.get('user/categories')
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
    <>
      <Header />
      <section className={cx("create-post-section")}>
        <div className={cx("create-post-section__container")}>
          <div className={cx("image-container")}>
            {image ? (
              <>
                <p>{image.name}</p>
                <img src={URL.createObjectURL(image)} alt='image' />
              </>
            ) : (
              <img src={img} alt='image' />
            )}
            <input
              type="file"
              ref={inputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          <div className={cx("btn-image-container")}>
            <button onClick={handleClickUploadImage} className={cx("btn-upload-image")}>
              Upload Image
            </button>
          </div>
          <div className={cx("form-container")}>
            <Form
              {...createPostFormLayout}
              form={form}
              layout='horizontal'
              name='create_post_form'
              labelAlign='right'
              labelWrap='true'
              size='large'
              autoComplete="off"
              onFinish={onCreatePostSuccessed}
              onFinishFailed={onCreatePostFailed}
              className={cx("modal-form")}
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
                <TextEditor />
              </Form.Item>
              <Form.Item
                wrapperCol={24}
              >
                <div className={cx("btn-container")}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={cx("btn-submit")}
                  >
                    Create Post
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Create
