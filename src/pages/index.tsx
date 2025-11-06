import { lazy } from "react";

const Home = lazy(() => import("./home"));
const Auth = lazy(() => import("./auth"));
const Product=lazy(()=>import ("./product"))
export { Home, Auth, Product};
