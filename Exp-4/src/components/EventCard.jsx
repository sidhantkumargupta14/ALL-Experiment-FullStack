import React, { memo, useEffect } from "react";

function EventCardBase({ post, optimized, onEdit, onDropDate, onRender, renderCount }) {
  useEffect(() => { onRender(post.id); }, [post.id, onRender]);
  const card = (
    <div
      className={"event " + post.status.toLowerCase()}
      draggable
      onDragStart={e => e.dataTransfer.setData("text/plain", String(post.id))}
      onClick={() => onEdit(post)}
      title="Click to edit • Drag to reschedule"
    >
      <b>{post.title}</b>
      <small>{post.time} · {post.platform}</small>
      <em>renders: {renderCount}</em>
    </div>
  );
  return card;
}

export default memo(EventCardBase, (a,b) => {
  if (!b.optimized) return false;
  return a.post === b.post && a.renderCount === b.renderCount && a.optimized === b.optimized;
});