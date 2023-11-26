import React, { useState } from "react"
import styles from './DetailsPages.module.scss'
import classNames from "classnames/bind";
import { BsPencilSquare } from "react-icons/bs"
import { AiOutlineDelete } from "react-icons/ai"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import Header from "../../components/header/Header";
import AuthUser from "../../utils/AuthUser";
import { storage } from '../../utils/firebase'
import { ref, getDownloadURL } from "firebase/storage"
import { LazyLoadImage } from "react-lazy-load-image-component";

const cx = classNames.bind(styles);

const DetailsPages = () => {
  const { http } = AuthUser();
  
  const { id } = useParams()
  const [newsDetail, setNewsDetail] = useState({})
  const [imageUrl, setImageUrl] = useState('');

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

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await http.get(`/user/news/${id}`);
        const newsDetail = response.data.news_detail;
        console.log('Detail:', response.data);

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

  return (
    <div className={cx("details-container")}>
      <Header />
      <section className={cx("single-page")}>
        <div className={cx("container")}>
          <div className={cx("left")}>
            <LazyLoadImage
              key={newsDetail.id}
              src={newsDetail.imageUrl}
              alt={`Blog ${newsDetail.id}`}
              effect="blur"
              width={1800}
              height={700}
              className={cx("scaled-img")}
            />
            {/* <img src={newsDetail.imageUrl} alt={newsDetail.title} width={1920} height={800} /> */}
          </div>
          <div className={cx("right")}>
            <div className={cx("buttons")}>
              <button className={cx("button")}>
                <BsPencilSquare />
              </button>
              <button className={cx("button")}>
                <AiOutlineDelete />
              </button>
            </div>
            <h1>{newsDetail.title}</h1>
            <p>{newsDetail.text}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DetailsPages