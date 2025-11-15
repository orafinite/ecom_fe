import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout";
import { Home, Auth, Product, CategoryPage, ProductDetail, CartPage, Review } from "@/pages";
import { Spinner } from "@/components/ui/spinner";

function App() {
  return (
    <Layout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Auth />} />
          
          {/* Products Routes - 3 Level Navigation */}
          <Route path="/products" element={<Product />} /> {/* Level 1: All Categories */}
          <Route path="/products/:categorySlug" element={<CategoryPage />} /> {/* Level 2: Products in Category */}
          <Route path="/products/:categorySlug/:productSlug" element={<ProductDetail />} /> {/* Level 3: Product Detail */}
          
          <Route path="/cart" element={<CartPage />} />
          <Route path="/reviews" element={<Review />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;