const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ In-memory storage for bookmarks
let bookmarks = [];
let currentId = 1;

// ----------------- API Routes -----------------

// Get all bookmarks
app.get("/bookmarks", (req, res) => {
  res.json(bookmarks);
});

// Add a new bookmark
app.post("/bookmarks", (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: "Title and URL required" });

  const newBookmark = { id: currentId++, title, url };
  bookmarks.push(newBookmark);
  res.status(201).json(newBookmark);
});

// Update a bookmark
app.put("/bookmarks/:id", (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  const bookmark = bookmarks.find((b) => b.id === parseInt(id));

  if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });

  bookmark.title = title;
  bookmark.url = url;
  res.json(bookmark);
});

// Delete a bookmark
app.delete("/bookmarks/:id", (req, res) => {
  const { id } = req.params;
  bookmarks = bookmarks.filter((b) => b.id !== parseInt(id));
  res.json({ success: true });
});

// ----------------- Serve React Frontend -----------------

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// ----------------- Start Server -----------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
