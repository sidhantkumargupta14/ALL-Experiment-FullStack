import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { createDraft } from "../features/drafts/draftsSlice";
import { publishPost } from "../features/posts/postsSlice";

const LIMITS = {
  Facebook: 63206,
  Instagram: 2200,
  LinkedIn: 3000,
  X: 280
};

export default function PostComposer() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState(["LinkedIn"]);
  const [message, setMessage] = useState("");

  const validation = useMemo(() => {
    if (!content.trim()) return "Write some content.";
    if (!platforms.length) return "Select at least one platform.";
    for (const platform of platforms) {
      if (content.length > LIMITS[platform]) {
        return `${platform}: ${content.length}/${LIMITS[platform]} characters`;
      }
    }
    return "";
  }, [content, platforms]);

  const remaining = Math.min(...platforms.map(p => LIMITS[p]));

  function toggle(platform) {
    setPlatforms(prev => prev.includes(platform)
      ? prev.filter(p => p !== platform)
      : [...prev, platform]
    );
  }

  async function saveDraft() {
    if (validation) return setMessage(validation);
    const result = await dispatch(createDraft({ title, content, platforms }));
    setMessage(result.meta.requestStatus === "fulfilled" ? "Draft saved successfully." : result.payload);
  }

  async function publish() {
    if (validation) return setMessage(validation);
    const result = await dispatch(publishPost({ title, content, platforms }));
    if (result.meta.requestStatus === "fulfilled") {
      setMessage("Post published successfully.");
      setTitle("");
      setContent("");
    } else setMessage(result.payload);
  }

  return (
    <section className="composer panel">
      <div className="section-head">
        <div>
          <span className="eyebrow">MULTI-PLATFORM COMPOSER</span>
          <h2>Create a Post</h2>
        </div>
        <span className={`counter ${content.length > remaining ? "danger" : ""}`}>
          {content.length}/{remaining}
        </span>
      </div>

      <label>Post Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter post title" />

      <label>Content</label>
      <textarea value={content} onChange={e => setContent(e.target.value)} rows="8"
        placeholder="Write your content here..." />

      <label>Platforms</label>
      <div className="platforms">
        {Object.keys(LIMITS).map(platform => (
          <button
            key={platform}
            type="button"
            className={`platform-btn ${platforms.includes(platform) ? "selected" : ""}`}
            onClick={() => toggle(platform)}
          >
            {platform}<small>max {LIMITS[platform]}</small>
          </button>
        ))}
      </div>

      {validation && <div className="error-box">{validation}</div>}
      {message && <div className="success-box">{message}</div>}

      <div className="actions">
        <button className="secondary-btn" onClick={saveDraft} disabled={!!validation}>Save Draft</button>
        <button className="red-btn" onClick={publish} disabled={!!validation}>Publish Post</button>
      </div>
    </section>
  );
}
