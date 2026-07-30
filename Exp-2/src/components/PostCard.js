import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  likePost,
  deletePost,
  startEditing,
  cancelEditing,
  updatePost
} from "../features/posts/postsSlice";

import CommentSection from "./CommentSection";

import "../styles/Post.css";

function PostCard({ post }) {

  const dispatch = useDispatch();

  const [text, setText] = useState(post.content);

  const [platform, setPlatform] = useState(post.platform);

  const [showComments, setShowComments] = useState(false);

  const savePost = () => {

    dispatch(

      updatePost({

        id: post.id,

        content: text,

        platform: platform

      })

    );

  };

  return (

    <div className="post-card">

      <div className="post-header">

        <div className="avatar">

          {post.author.charAt(0).toUpperCase()}

        </div>

        <div>

          <h3>{post.author}</h3>

          <p>

            {post.platform} • {post.date}

          </p>

        </div>

      </div>

      {

        post.editing ?

        <>

          <select

            value={platform}

            onChange={(e)=>setPlatform(e.target.value)}

          >

            <option>LinkedIn</option>

            <option>Facebook</option>

            <option>Instagram</option>

            <option>X (Twitter)</option>

          </select>

          <textarea

            rows="4"

            value={text}

            onChange={(e)=>setText(e.target.value)}

          />

          <div className="edit-buttons">

            <button

              className="save"

              onClick={savePost}

            >

              Save

            </button>

            <button

              className="cancel"

              onClick={()=>

                dispatch(cancelEditing(post.id))

              }

            >

              Cancel

            </button>

          </div>

        </>

        :

        <p className="content">

          {post.content}

        </p>

      }

      <div className="post-actions">

        <button

          onClick={()=>

            dispatch(likePost(post.id))

          }

        >

          ❤️ {post.likes}

        </button>

        <button

          onClick={()=>

            dispatch(startEditing(post.id))

          }

        >

          ✏️ Edit

        </button>

        <button

          onClick={()=>

            dispatch(deletePost(post.id))

          }

        >

          🗑 Delete

        </button>

        <button

          onClick={()=>

            setShowComments(!showComments)

          }

        >

          💬 Comments

        </button>

      </div>

      {

        showComments &&

        <CommentSection

          postId={post.id}

        />

      }

    </div>

  );

}

export default React.memo(PostCard);