import React, { useCallback, useMemo, useState } from "react";
import { CalendarDays, Plus, Zap, ZapOff, Trash2, Save, X } from "lucide-react";
import { initialPosts } from "./data";
import EventCard from "./components/EventCard";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function monthDays(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function App() {
  const today = new Date("2026-09-15T00:00:00");
  const [cursor, setCursor] = useState(new Date(today));
  const [posts, setPosts] = useState(initialPosts);
  const [optimized, setOptimized] = useState(true);
  const [renderCounts, setRenderCounts] = useState({});
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: "", date: formatDate(today), time: "10:00", platform: "LinkedIn", status: "Scheduled" });

  const days = useMemo(() => monthDays(cursor.getFullYear(), cursor.getMonth()), [cursor]);

  const eventsByDate = useMemo(() => {
    const map = {};
    posts.forEach(p => (map[p.date] ??= []).push(p));
    return map;
  }, [posts]);

  const weekStart = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }, []);
  const week = useMemo(() => Array.from({length: 7}, (_, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d;
  }), [weekStart]);

  const bumpRender = useCallback((id) => {
    setRenderCounts(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }, []);

  const openNew = (date = formatDate(today)) => {
    setSelected({ new: true });
    setForm({ title: "", date, time: "10:00", platform: "LinkedIn", status: "Scheduled" });
  };

  const editPost = useCallback((post) => {
    setSelected(post);
    setForm({ ...post });
  }, []);

  const savePost = () => {
    if (!form.title.trim()) return;
    if (selected?.new) {
      setPosts(p => [...p, { ...form, id: Date.now() }]);
    } else {
      setPosts(p => p.map(x => x.id === selected.id ? { ...form, id: x.id } : x));
    }
    setSelected(null);
  };

  const deletePost = () => {
    if (!selected || selected.new) return;
    setPosts(p => p.filter(x => x.id !== selected.id));
    setSelected(null);
  };

  const movePost = useCallback((id, date) => {
    setPosts(p => p.map(x => x.id === id ? { ...x, date } : x));
  }, []);

  const changeMonth = (delta) => {
    setCursor(d => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  };

  const renderEvent = (post) => (
    <EventCard
      key={post.id}
      post={post}
      optimized={optimized}
      onEdit={editPost}
      onDropDate={movePost}
      onRender={bumpRender}
      renderCount={renderCounts[post.id] || 0}
    />
  );

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="eyebrow">POST SCHEDULER LAB</div>
          <h1><CalendarDays size={30}/> Interactive Calendar</h1>
          <p>Scheduling + Drag & Drop + Rendering Optimization + Testing</p>
        </div>
        <div className="toolbar">
          <button className={optimized ? "toggle on" : "toggle"} onClick={() => setOptimized(v => !v)}>
            {optimized ? <Zap size={17}/> : <ZapOff size={17}/>}
            Optimization: {optimized ? "ON" : "OFF"}
          </button>
          <button className="primary" onClick={() => openNew()}><Plus size={17}/> New Post</button>
        </div>
      </header>

      <section className="stats">
        <div><b>{posts.length}</b><span>Total Posts</span></div>
        <div><b>{optimized ? "Memoized" : "Normal"}</b><span>Render Mode</span></div>
        <div><b>{Object.values(renderCounts).reduce((a,b)=>a+b,0)}</b><span>Event Renders</span></div>
        <div><b>5176</b><span>App Port</span></div>
      </section>

      <main>
        <section className="calendar-panel">
          <div className="calendar-head">
            <button onClick={() => changeMonth(-1)}>‹</button>
            <h2>{cursor.toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
            <button onClick={() => changeMonth(1)}>›</button>
          </div>
          <div className="weekday">{DAYS.map(d => <div key={d}>{d}</div>)}</div>
          <div className="month-grid">
            {days.map(d => {
              const key = formatDate(d);
              const items = eventsByDate[key] || [];
              const muted = d.getMonth() !== cursor.getMonth();
              return (
                <div className={"day-cell " + (muted ? "muted" : "")}
                  key={key}
                  onDoubleClick={() => openNew(key)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); if (id) movePost(id, key); }}>
                  <span className="day-number">{d.getDate()}</span>
                  {items.map(renderEvent)}
                  <button className="add-mini" onClick={() => openNew(key)}>+</button>
                </div>
              );
            })}
          </div>
          <p className="hint">Tip: drag an event to another day. Double-click a day to create a post.</p>
        </section>

        <section className="week-panel">
          <div className="section-title"><h2>One-Week View</h2><span>Current teaching/demo week</span></div>
          <div className="week-grid">
            {week.map(d => {
              const key = formatDate(d);
              return <div className="week-day" key={key}>
                <div className="week-label">{DAYS[d.getDay()]} <b>{d.getDate()}</b></div>
                {(eventsByDate[key] || []).map(renderEvent)}
              </div>;
            })}
          </div>
        </section>

        <section className="render-panel">
          <div className="section-title"><h2>Render Count Monitor</h2><span>Compare ON vs OFF</span></div>
          <div className="render-list">
            {posts.map(p => <div key={p.id}><span>{p.title}</span><b>{renderCounts[p.id] || 0}</b></div>)}
          </div>
        </section>
      </main>

      {selected && <div className="modal-backdrop">
        <div className="modal">
          <button className="close" onClick={() => setSelected(null)}><X/></button>
          <h2>{selected.new ? "Create Post" : "Edit Post"}</h2>
          <label>Title<input value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Post title"/></label>
          <div className="two"><label>Date<input type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})}/></label><label>Time<input type="time" value={form.time} onChange={e => setForm({...form,time:e.target.value})}/></label></div>
          <div className="two"><label>Platform<select value={form.platform} onChange={e => setForm({...form,platform:e.target.value})}><option>LinkedIn</option><option>Instagram</option><option>X</option><option>Facebook</option></select></label><label>Status<select value={form.status} onChange={e => setForm({...form,status:e.target.value})}><option>Scheduled</option><option>Draft</option></select></label></div>
          <div className="actions">
            {!selected.new && <button className="danger" onClick={deletePost}><Trash2 size={16}/> Delete</button>}
            <button onClick={() => setSelected(null)}>Cancel</button>
            <button className="primary" onClick={savePost}><Save size={16}/> Save</button>
          </div>
        </div>
      </div>}
    </div>
  );
}