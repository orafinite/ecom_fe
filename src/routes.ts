export const publicRoutes = [
    "/",
    "/home",
    "/register",
    "/login",
    "/login/:username",
    "/available-domains",
    "/active-account/:username",
];

export const protectedRoutes = [
    "/dashboard",
    "/dashboard/.*",
    "/home/formbuilder/.*",
];

export const rolebaseRoutes = [
    { path: "/dashboard/domain", roles: ["superadmin"] },
    { path: "/dashboard/users", roles: ["superadmin"] },
    { path: "/dashboard/site-management", roles: ["admin"] },
    { path: "/home/formbuilder/:form_type", roles: ["admin"] } 
];

export const authRoutes = [
    "/register",
    "/login",
    "login/:username",
    "active-account/:username",
];

export const Default_Login_Redirect = "/dashboard";