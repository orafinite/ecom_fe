
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import { Home, Auth, Product, CartPage, Review } from "@/pages";
import { Spinner } from "@/components/ui/spinner";

const ProductDetail = lazy(() => import("./pages/product/detail"));


function App() {

  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/products" element={<Product/>} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/reviews" element={<Review />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
