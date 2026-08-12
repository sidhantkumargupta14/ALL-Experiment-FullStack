import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./Navbar";
import { deleteDraft, fetchDrafts, updateDraft } from "../features/drafts/draftsSlice";
import { selectDrafts } from "../features/selectors";

export default function Drafts() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const drafts = useSelector(selectDrafts);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchDrafts());
  }, [dispatch]);

  async function remove(id) {
    if (window.confirm("Delete this draft?")) dispatch(deleteDraft(id));
  }

  async function saveEdit(e, draft) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title");
    const content = form.get("content");
    await dispatch(updateDraft({
      id: draft.id,
      title,
      content,
      platforms: draft.platforms
    }));
    setEditing(null);
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="section-head page-title">
          <div>
            <span className="eyebrow">CRUD MANAGEMENT</span>
            <h1>Post Drafts</h1>
          </div>
          <span className="count-badge">{drafts.length} drafts</span>
        </div>

        {drafts.length === 0 ? (
          <div className="empty panel">No drafts available.</div>
        ) : (
          <div className="draft-grid">
            {drafts.map(draft => (
              <article className="draft-card" key={draft.id}>
                {editing === draft.id ? (
                  <form onSubmit={e => saveEdit(e, draft)}>
                    <input name="title" defaultValue={draft.title} />
                    <textarea name="content" defaultValue={draft.content} rows="6" />
                    <div className="actions">
                      <button className="red-btn">Save</button>
                      <button type="button" className="secondary-btn" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="draft-top">
                      <h3>{draft.title}</h3>
                      <span className="status">DRAFT</span>
                    </div>
                    <p>{draft.content}</p>
                    <div className="tag-row">{draft.platforms.map(p => <span key={p}>{p}</span>)}</div>
                    <small>Updated: {new Date(draft.updatedAt).toLocaleString()}</small>

                    {user?.role !== "Viewer" && (
                      <div className="actions">
                        <button className="secondary-btn" onClick={() => setEditing(draft.id)}>Edit</button>
                        <button className="danger-btn" onClick={() => remove(draft.id)}>Delete</button>
                      </div>
                    )}
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
