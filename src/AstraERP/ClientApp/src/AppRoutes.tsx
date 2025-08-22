import { Routes, Route } from "react-router-dom";

function Home() {
  return <div>AstraERP is running 🚀</div>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
