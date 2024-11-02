import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main, Detail } from "./pages";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/detail/*" element={<Detail />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
