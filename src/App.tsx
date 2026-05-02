import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/app/AppShell";
import { ReadingRoom } from "./pages/reading-room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/r/:token" element={<ReadingRoom />} />
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
