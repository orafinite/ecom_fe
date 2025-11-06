import { lazy } from "react";

const Home = lazy(() => import("./home"));
const Auth = lazy(() => import("./auth"));

export { Home, Auth };
