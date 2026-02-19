import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // ✅ Use relative URLs so it works both locally and on Render
  const fetchBookmarks = async () => {
    try {
      const res = await axios.get("/bookmarks"); // changed from localhost
      setBookmarks(res.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !url) return;

    try {
      if (editId) {
        await axios.put(`/bookmarks/${editId}`, { title, url }); // changed
        setEditId(null);
      } else {
        await axios.post("/bookmarks", { title, url }); // changed
      }
      setTitle("");
      setUrl("");
      fetchBookmarks();
    } catch (err) {
      console.error("Error saving bookmark:", err);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await axios.delete(`/bookmarks/${id}`); // changed
      fetchBookmarks();
    } catch (err) {
      console.error("Error deleting bookmark:", err);
    }
  };

  const editBookmark = (bookmark) => {
    setTitle(bookmark.title);
    setUrl(bookmark.url);
    setEditId(bookmark.id);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="heading">Smart Bookmark CRUD Application</h2>

        <div className="input-section">
          <input
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="add-btn" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <ul>
          {bookmarks.map((b) => (
            <li key={b.id} className="bookmark-item">
              <a href={b.url} target="_blank" rel="noreferrer">
                {b.title}
              </a>
              <div className="button-group">
                <button className="edit-btn" onClick={() => editBookmark(b)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteBookmark(b.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
