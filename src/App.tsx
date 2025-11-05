import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import { Home, Auth } from "@/pages";

function App() {
  const routes = useMemo(
    () => (
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    ),
    [],
  );

  return <Layout>{routes}</Layout>;
}

export default App;
