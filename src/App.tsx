
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import { Home, Auth } from "@/pages";
import { Spinner } from "@/components/ui/spinner";

function App() {

  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
