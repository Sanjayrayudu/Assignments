import {Routes, Route } from "react-router-dom";
import Assignment from "./Components/Assignment";
import BlogEditor from './Components/BlogEditor';
function App() {
  return (
    <div>
    <Routes>
  <Route path="/" element = {<Assignment />} />
  <Route path="/blog-editor" element={<BlogEditor/>} />
  </Routes>
    </div>
  );
}

export default App;
