import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Pagination from "./pages/Pagination";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pagination />} />
      </Routes>
    </Router>
  );
};

export default App;
