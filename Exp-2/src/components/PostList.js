import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";
import { selectFilteredPosts } from "../features/posts/selectors";
import PostCard from "./PostCard";

function PostList() {

  const dispatch = useDispatch();

  const posts = useSelector(selectFilteredPosts);

  const loading = useSelector(
    state => state.posts.loading
  );

  useEffect(() => {

    if(posts.length===0){

      dispatch(fetchPosts());

    }

  }, [dispatch]);

  if(loading){

    return <h2>Loading Posts...</h2>;

  }

  if(posts.length===0){

    return <h2>No Posts Found</h2>;

  }

  return (

    <div>

      {

        posts.map(post=>(

          <PostCard
            key={post.id}
            post={post}
          />

        ))

      }

    </div>

  );

}

export default PostList;