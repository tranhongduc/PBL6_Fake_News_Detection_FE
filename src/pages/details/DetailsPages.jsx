import React, { useState } from "react";
import styles from "./DetailsPages.module.scss";
import classNames from "classnames/bind";
import { BsPencilSquare } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { blog } from "../../assets/data/data";
import Header from "../../components/header/Header";
import Comments from "../../components/comment/Comment";
import AuthUser from "../../utils/AuthUser";

const cx = classNames.bind(styles);

const DetailsPages = () => {
  const { http } = AuthUser();
  const { id } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [comments, setComment] = useState([]);

  useEffect(() => {
    let blogs = blog.find((blogs) => blogs.id === parseInt(id));
    if (blogs) {
      setBlogs(blogs);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await http
        .get(`/api/user/comments/`)
        .then((resolve) => {
          console.log(resolve);
          setComment(resolve.data.coments);
        })
        .catch((reject) => {
          console.log(reject);
        });
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      {blogs ? (
        <section className={cx("singlePage")}>
          <div className={cx("container")}>
            <div className={cx("left")}>
              <img src={blogs.cover} alt="" />
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
              <h1>Betadine Feminine Wash</h1>
              <p>{blogs.desc}</p>
              <p>
                "But I must explain to you how all this mistaken idea of
                denouncing pleasure and praising pain was born and I will give
                you a complete account of the system, and expound the actual
                teachings of the great explorer of the truth, the master-builder
                of human happiness. No one rejects, dislikes, or avoids pleasure
                itself, because it is pleasure, but because those who do not
                know how to pursue pleasure rationally encounter consequences
                that are extremely painful. Nor again is there anyone who loves
                or pursues or desires to obtain pain of itself, because it is
                pain, but because occasionally circumstances occur in which toil
                and pain can procure him some great pleasure. To take a trivial
                example, which of us ever undertakes laborious physical
                exercise, except to obtain some advantage from it? But who has
                any right to find fault with a man who chooses to enjoy a
                pleasure that has no annoying consequences, or one who avoids a
                pain that produces no resultant pleasure?" Section 1.10.33 of
                "de Finibus Bonorum et Malorum", written by Cicero in 45 BC "At
                vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                rerum facilis est et expedita distinctio. Nam libero tempore,
                cum soluta nobis est eligendi optio cumque nihil impedit quo
                minus id quod maxime placeat facere possimus, omnis voluptas
                assumenda est, omnis dolor repellendus. Temporibus autem
                quibusdam et aut officiis debitis aut rerum necessitatibus saepe
                eveniet ut et voluptates repudiandae sint et molestiae non
                recusandae. Itaque earum rerum hic tenetur a sapiente delectus,
                ut aut reiciendis voluptatibus maiores alias consequatur aut
                perferendis doloribus asperiores repellat."
              </p>
              <p>Author: Sunil</p>
            </div>

            <h1>Comment</h1>

            <div className={cx("Comment")}>
              <div className={cx("Comment__contain")}>
                {comments.map((comment) => (
                  <Comments
                    username={comment?.account_id}
                    comment={comment?.text}
                  ></Comments>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default DetailsPages;
