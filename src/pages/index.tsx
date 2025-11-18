import { lazy } from "react";

const Home = lazy(() => import("./home"));
const Auth = lazy(() => import("./auth"));
const Product = lazy(() => import("./product"));
const CategoryPage = lazy(() => import("./product/CategoryPage"));
const ProductDetail = lazy(() => import("./product/detail"));
const CartPage = lazy(() => import("./cart"));
const CheckoutPage = lazy(() => import("./checkout"));
const Review = lazy(() => import("./review"));

export {
  Home,
  Auth,
  Product,
  CategoryPage,
  ProductDetail,
  CartPage,
  CheckoutPage,
  Review,
};
