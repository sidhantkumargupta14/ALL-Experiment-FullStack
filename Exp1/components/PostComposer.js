import React, { useState } from "react";
import "./PostComposer.css";

function PostComposer() {

    const limits = {

        Twitter:280,
        Facebook:63206,
        LinkedIn:3000,
        Instagram:2200
    };

    const [platform, setPlatform] = useState("Twitter");
    const [post, setPost] = useState("");

    const limit = limits[platform];

    const remaining = limit - post.length;

    const exceeded = remaining < 0;

    return (

        <div className="container">

            <h1>Dynamic Post Composer</h1>

            <label>Select Platform</label>

            <select

                value={platform}

                onChange={(e)=>{

                    setPlatform(e.target.value);
                    setPost("");

                }}

            >

                <option>Twitter</option>
                <option>Facebook</option>
                <option>LinkedIn</option>
                <option>Instagram</option>

            </select>

            <textarea

                rows="8"

                placeholder="Write your post..."

                value={post}

                onChange={(e)=>setPost(e.target.value)}

            />

            <div className="counter">

                <p>

                    Characters : {post.length}/{limit}

                </p>

                {

                    exceeded ?

                    <p className="error">

                        Exceeded by {Math.abs(remaining)} characters

                    </p>

                    :

                    <p className="success">

                        {remaining} characters remaining

                    </p>

                }

            </div>

            <button

                disabled={exceeded || post.length===0}

            >

                Publish

            </button>

        </div>

    );

}

export default PostComposer;