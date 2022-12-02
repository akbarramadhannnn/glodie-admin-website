import React from "react";
import { Redirect } from "react-router-dom";

// User profile
import UserProfile from "../pages/Authentication/UserProfile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
// import Logout from "../pages/Authentication/Logout";
// import Register from "../pages/Authentication/Register";
// import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import Collections from '../pages/Koleksi';
import Teams from '../pages/Tim';
import Donasi from '../pages/Donasi';
import WebsiteHome from '../pages/Website/Home';
import WebsiteTeam from '../pages/Website/Team';
import Account from '../pages/Account';

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/collection", component: Collections },
  { path: "/team", component: Teams },
  { path: "/donation", component: Donasi },
  { path: "/website/home", component: WebsiteHome },
  { path: "/website/team", component: WebsiteTeam },
  { path: "/account", component: Account },

  //profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const publicRoutes = [
  // { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  // { path: "/forgot-password", component: ForgetPwd },
  // { path: "/register", component: Register },
];

export { authProtectedRoutes, publicRoutes };