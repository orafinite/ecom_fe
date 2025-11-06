
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import { Home, Auth } from "@/pages";
import { Spinner } from "@/components/ui/spinner";
import Products from "@/pages/product"

function App() {

  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
