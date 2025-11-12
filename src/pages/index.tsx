import { lazy } from "react";

const Home = lazy(() => import("./home"));
const Auth = lazy(() => import("./auth"));
const Product = lazy(() => import("./product"));
const CartPage = lazy(() => import("./cart"));
const Review = lazy(() => import("./review"));
export { Home, Auth, Product, CartPage, Review };
