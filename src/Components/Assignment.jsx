import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BlogEditor from './BlogEditor';

const Assignment = () => {
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  const [categories, setCategories] = useState(['All', 'Custom', 'ICP', 'Mission', 'Product']);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [topics, setTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [blogContents, setBlogContents] = useState({});

  useEffect(() => {
    const storedTopics = localStorage.getItem('topics');
    if (storedTopics) {
      setTopics(JSON.parse(storedTopics));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    if (location.state && location.state.topics) {
      setTopics(location.state.topics);
    }
  }, [location.state]);

  const handleAddOption = () => {
    setShowDialog(true);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    const topicName = e.target.elements.topicName.value.trim();
    const keywords = e.target.elements.keywords.value.trim();

    if (topicName && keywords) {
      const newTopic = {
        name: topicName,
        keywords: keywords.split(',').map((keyword) => keyword.trim()),
      };
      setTopics((prevTopics) => ({
        ...prevTopics,
        [currentCategory]: [...(prevTopics[currentCategory] || []), newTopic],
      }));
      e.target.reset();
      setShowDialog(false);
    }
  };

  const handleDeleteTopic = (category, index) => {
    const updatedTopics = { ...topics };
    const deletedTopic = updatedTopics[category][index];
    updatedTopics[category].splice(index, 1);
    setTopics(updatedTopics);
  
    // Delete the corresponding blog content
    setBlogContents((prevContents) => {
      const updatedContents = { ...prevContents };
      delete updatedContents[deletedTopic.name];
      return updatedContents;
    });
  };

  const handleWriteBlog = (topic) => {
    setSelectedTopic(topic);
  };

  const handleCancelBlog = () => {
    setSelectedTopic(null);
    setBlogContents((prevContents) => {
      const updatedContents = { ...prevContents };
      delete updatedContents[selectedTopic];
      return updatedContents;
    });
  };
  

  const handleSaveBlogContent = (content) => {
    setBlogContents((prevContents) => ({
      ...prevContents,
      [selectedTopic]: content,
    }));
    setSelectedTopic(null);
  };

  return (
    <div>
      <h1 style={{ marginTop: '10px' }}>Categories</h1>

      <div className="category-row">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category ${currentCategory === category ? 'active' : ''}`}
            onClick={() => setCurrentCategory(category)}
          >
            {category}
          </div>
        ))}
        <button className="add-option-button" onClick={handleAddOption} style={{ marginLeft: '374px' }}>
          Add Option
        </button>
      </div>
      <hr style={{ marginTop: '18px' }} />

      {showDialog && (
        <div className="dialog">
          <h2>Add Topic</h2>
          <form onSubmit={handleAddTopic}>
            <input type="text" name="topicName" placeholder="Topic Name" required />
            <input type="text" name="keywords" placeholder="Keywords (comma-separated)" required />
            <button type="submit">Add Topic</button>
          </form>
          <button onClick={() => setShowDialog(false)}>Cancel</button>
        </div>
      )}

      {currentCategory && (
        <div>
          <h2 style={{ fontSize: '30px', marginTop: '-20px' }}>Recommended Topics</h2>
          <hr style={{ marginTop: '-4px' }}></hr>
          <div className="topic-list">
            {topics[currentCategory] &&
              topics[currentCategory].map((topic, index) => (
                <div key={index} className="topic-box">
                  <div className="topic-header">
                    <h3>{topic.name}</h3>
                    <button
                      style={{
                        marginRight: '21px',
                        backgroundColor: 'orange',
                        height: '45px',
                        width: '90px',
                      }}
                      onClick={() => handleWriteBlog(topic.name)}
                    >
                      Write
                    </button>
                  </div>
                  <div className="keywords">
                    {topic.keywords.map((keyword, keywordIndex) => (
                      <div
                        key={keywordIndex}
                        className="keyword-box"
                        style={{
                          backgroundColor: `hsl(${(index * 30 + keywordIndex * 50) % 360}, 70%, 90%)`,
                        }}
                      >
                        {keyword}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteTopic(currentCategory, index)}
                    className="btn btn-danger"
                    style={{ marginTop: '10px' }}
                  >
                    Delete Topic <i className="bi bi-trash"></i>
                  </button>
                  <hr style={{ marginTop: '5px' }}></hr>
                </div>
              ))}
          </div>
        </div>
      )}

      {selectedTopic && (
        <div>
          <BlogEditor
            topic={selectedTopic}
            onSaveBlogContent={handleSaveBlogContent}
            onCancelBlog={handleCancelBlog}
          />
        </div>
      )}

      {Object.keys(blogContents).map((topic) => (
        <div key={topic}>
          {blogContents[topic] && (
            <div>
              <h2>Blog Content for {topic}:</h2>
              <div>
                <h3>Content:</h3>
                <pre>{blogContents[topic].content}</pre>
              </div>
              <div>
                <h3>Image:</h3>
                {blogContents[topic].image && <img src={URL.createObjectURL(blogContents[topic].image)} alt="Blog" style={{ maxWidth: '200px', height: '200px' }}/>}
              </div>
            </div>
          )}
          <hr></hr>
        </div>
      ))}

      <style>
        {`
          .category-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            gap: 100px;
            margin-top: 50px;
            margin-left: 94px;
          }

          .category {
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
          }

          .category.active {
            background-color: lightblue;
          }

          .add-option-button {
            padding: 10px;
            background-color: orange;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
            z-index: 9999;
          }

          .dialog h2 {
            font-size: 20px;
            margin-bottom: 10px;
          }

          .dialog input {
            margin-bottom: 10px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .dialog button {
            padding: 8px 16px;
            background-color: #eee;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
          }

          .topic-list {
            margin-top: 20px;
          }

          .topic-box {
            margin-bottom: 20px;
          }

          .topic-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
          }

          .keywords {
            display: flex;
            flex-wrap: wrap;
            margin-top: 5px;
          }

          .keyword-box {
            display: inline-block;
            margin-right: 5px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
            color: #333;
          }
        `}
      </style>
    </div>
  );
};

export default Assignment;
