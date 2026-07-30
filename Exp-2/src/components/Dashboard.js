import { useSelector } from "react-redux";

import {
  totalPosts,
  totalLikes,
  totalComments,
  averageLikes,
  mostLikedPost,
  mostUsedPlatform,
  engagementRate,
} from "../features/posts/selectors";

import "../styles/Dashboard.css";

function Dashboard() {

  const posts = useSelector(totalPosts);
  const likes = useSelector(totalLikes);
  const comments = useSelector(totalComments);
  const average = useSelector(averageLikes);
  const topPost = useSelector(mostLikedPost);
  const platform = useSelector(mostUsedPlatform);
  const engagement = useSelector(engagementRate);

  return (

    <div className="dashboard">

      <div className="card">
        <h2>{posts}</h2>
        <p>Total Posts</p>
      </div>

      <div className="card">
        <h2>{likes}</h2>
        <p>Total Likes</p>
      </div>

      <div className="card">
        <h2>{comments}</h2>
        <p>Total Comments</p>
      </div>

      <div className="card">
        <h2>{average}</h2>
        <p>Average Likes/Post</p>
      </div>

      <div className="card">
        <h2>{engagement}</h2>
        <p>Engagement Rate</p>
      </div>

      <div className="card">
        <h2>{platform}</h2>
        <p>Top Platform</p>
      </div>

      <div className="card wide">
        <h3>🔥 Most Liked Post</h3>

        {topPost ? (
          <>
            <strong>{topPost.author}</strong>

            <p>{topPost.content}</p>

            <h4>❤️ {topPost.likes} Likes</h4>
          </>
        ) : (
          <p>No posts available.</p>
        )}
      </div>

    </div>

  );

}

export default Dashboard;