import { Routes, Route } from "react-router-dom";
import { SubmitPage } from "./pages/SubmitPage";
import { TaskPage } from "./pages/TaskPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SubmitPage />} />
      <Route path="/tasks/:taskId" element={<TaskPage />} />
    </Routes>
  );
}

export default App;
