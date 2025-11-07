
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import { Home, Auth,Product,CartPage } from "@/pages";
import { Spinner } from "@/components/ui/spinner";


function App() {

  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/products" element={<Product/>} />
          <Route path="/cart" element={<CartPage/>} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
