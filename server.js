const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Sample in-memory database
let bookmarks = [];
let idCounter = 1;

app.get("/bookmarks", (req, res) => res.json(bookmarks));
app.post("/bookmarks", (req, res) => {
  const { title, url } = req.body;
  const bookmark = { id: idCounter++, title, url };
  bookmarks.push(bookmark);
  res.json(bookmark);
});
app.put("/bookmarks/:id", (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  const bookmark = bookmarks.find(b => b.id == id);
  if (bookmark) {
    bookmark.title = title;
    bookmark.url = url;
    res.json(bookmark);
  } else res.status(404).json({ error: "Not found" });
});
app.delete("/bookmarks/:id", (req, res) => {
  bookmarks = bookmarks.filter(b => b.id != req.params.id);
  res.json({ success: true });
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
