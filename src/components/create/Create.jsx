import React from "react"
import styles from './Create.module.scss'
import classNames from "classnames/bind";
import { IoIosAddCircleOutline } from "react-icons/io"

const cx = classNames.bind(styles);

const Create = () => {
  return (
    <>
      <section className={cx("newPost")}>
        <div className={cx("container boxItems")}>
          <div className={cx("img")}>
            <img src='https://images.pexels.com/photos/6424244/pexels-photo-6424244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt='image' class='image-preview' />
          </div>
          <form>
            <div className={cx("inputfile flexCenter")}>
              <input type='file' accept='image/*' alt='img' />
            </div>
            <input type='text' placeholder='Title' />

            <textarea name='' id='' cols='30' rows='10'></textarea>

            <button className={cx("button")}>Create Post</button>
          </form>
        </div>
      </section>
    </>
  )
}

export default Create
