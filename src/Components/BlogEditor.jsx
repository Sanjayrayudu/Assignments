import React, { useState } from 'react';

const BlogEditor = ({ topic, onSaveBlogContent, onCancelBlog }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSave = () => {
    onSaveBlogContent({
      topic,
      content,
      image,
    });
  };

  return (
    <div>
      <h2>Write a Blog for {topic}</h2>
      <div>
        <textarea
          rows="10"
          cols="50"
          width="1000px"
          placeholder="Enter your blog content"
          value={content}
          onChange={handleContentChange}
        ></textarea>
      </div>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancelBlog}>Cancel</button>
      </div>
    </div>
  );
};

export default BlogEditor;
