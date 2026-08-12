require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "development_secret";

app.use(cors());
app.use(express.json());

const users = [
  {
    id: "u1",
    username: "admin",
    name: "Admin User",
    role: "Admin",
    passwordHash: bcrypt.hashSync("admin123", 10)
  },
  {
    id: "u2",
    username: "editor",
    name: "Editor User",
    role: "Editor",
    passwordHash: bcrypt.hashSync("editor123", 10)
  },
  {
    id: "u3",
    username: "viewer",
    name: "Viewer User",
    role: "Viewer",
    passwordHash: bcrypt.hashSync("viewer123", 10)
  }
];

let drafts = [
  {
    id: "d1",
    title: "Welcome Post",
    content: "Welcome to the Unified Post Platform!",
    platforms: ["LinkedIn"],
    status: "draft",
    authorId: "u1",
    updatedAt: new Date().toISOString()
  }
];

let posts = [];

const platformLimits = {
  Facebook: 63206,
  Instagram: 2200,
  LinkedIn: 3000,
  X: 280
};

function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Authentication required." });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

function allow(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission for this action." });
    }
    next();
  };
}

function validatePost(content, platforms) {
  if (!content || !content.trim()) return "Content is required.";
  if (!Array.isArray(platforms) || platforms.length === 0) {
    return "Select at least one platform.";
  }

  for (const platform of platforms) {
    const limit = platformLimits[platform];
    if (!limit) return `Unsupported platform: ${platform}`;
    if (content.length > limit) {
      return `${platform} allows a maximum of ${limit} characters.`;
    }
  }
  return null;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

app.get("/api/auth/me", auth, (req, res) => {
  const user = users.find(u => u.id === req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found." });

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role
  });
});

app.get("/api/drafts", auth, (req, res) => {
  const visible = req.user.role === "Admin"
    ? drafts
    : drafts.filter(d => d.authorId === req.user.sub);

  res.json(visible);
});

app.post("/api/drafts", auth, allow("Admin", "Editor"), (req, res) => {
  const { title, content, platforms } = req.body;
  const validation = validatePost(content, platforms);
  if (validation) return res.status(400).json({ message: validation });

  const draft = {
    id: crypto.randomUUID(),
    title: title?.trim() || "Untitled Draft",
    content,
    platforms,
    status: "draft",
    authorId: req.user.sub,
    updatedAt: new Date().toISOString()
  };

  drafts.unshift(draft);
  res.status(201).json(draft);
});

app.put("/api/drafts/:id", auth, allow("Admin", "Editor"), (req, res) => {
  const draft = drafts.find(d => d.id === req.params.id);
  if (!draft) return res.status(404).json({ message: "Draft not found." });

  if (req.user.role !== "Admin" && draft.authorId !== req.user.sub) {
    return res.status(403).json({ message: "You can only edit your own drafts." });
  }

  const { title, content, platforms } = req.body;
  const validation = validatePost(content, platforms);
  if (validation) return res.status(400).json({ message: validation });

  Object.assign(draft, {
    title: title?.trim() || "Untitled Draft",
    content,
    platforms,
    updatedAt: new Date().toISOString()
  });

  res.json(draft);
});

app.delete("/api/drafts/:id", auth, allow("Admin", "Editor"), (req, res) => {
  const index = drafts.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Draft not found." });

  if (req.user.role !== "Admin" && drafts[index].authorId !== req.user.sub) {
    return res.status(403).json({ message: "You can only delete your own drafts." });
  }

  const [deleted] = drafts.splice(index, 1);
  res.json(deleted);
});

app.get("/api/posts", auth, (req, res) => {
  res.json(posts);
});

app.post("/api/posts", auth, allow("Admin", "Editor"), (req, res) => {
  const { title, content, platforms } = req.body;
  const validation = validatePost(content, platforms);
  if (validation) return res.status(400).json({ message: validation });

  const post = {
    id: crypto.randomUUID(),
    title: title?.trim() || "Untitled Post",
    content, platforms,
    authorId: req.user.sub,
    authorRole: req.user.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  posts.unshift(post);
  res.status(201).json(post);
});

app.put("/api/posts/:id", auth, allow("Admin", "Editor"), (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found." });

  const { title, content, platforms } = req.body;
  const validation = validatePost(content, platforms);
  if (validation) return res.status(400).json({ message: validation });

  Object.assign(post, {
    title: title?.trim() || "Untitled Post",
    content, platforms,
    updatedAt: new Date().toISOString()
  });
  res.json(post);
});

app.delete("/api/posts/:id", auth, allow("Admin"), (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Post not found." });
  const [deleted] = posts.splice(index, 1);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
