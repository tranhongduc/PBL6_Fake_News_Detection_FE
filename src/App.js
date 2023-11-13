import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./utils/ScrollToTop";
import "react-toastify/dist/ReactToastify.css";
import 'react-lazy-load-image-component/src/effects/blur.css';
import Unauthorized from "./pages/unauthorized/Unauthorized";
import NotFound from "./pages/notFound/NotFound";
import Dashboard from "./pages/admin/scenes/Dashboard/Dashboard";

const Loading = lazy(() => import("./components/loading/Loading"));
const Home = lazy(() => import("./pages/home/Home"));
const Register = lazy(() => import("./pages/register/Register"));
const DetailsPages = lazy(() => import("./pages/details/DetailsPages"));
const Account = lazy(() => import("./pages/account/Account"));
const Create = lazy(() => import("./components/create/Create"));
const Login = lazy(() => import("./pages/login/Login"));
const DashBoard = lazy(() => import("./pages/admin/scenes/Dashboard/Dashboard"));
const Team = lazy(() => import("./pages/admin/u/team"));
const Contacts = lazy(() => import("./pages/admin/u/contacts"));
const Invoices = lazy(() => import("./pages/admin/u/invoices"));
const ViewUser = lazy(() => import("./pages/admin/scenes/ViewUser/ViewUser"));
const User = lazy(() => import("./pages/admin/scenes/User/User"));
const Category = lazy(() => import("./pages/admin/scenes/Category/Category"));
const ViewCategory = lazy(() => import("./pages/admin/scenes/ViewCategory/ViewCategory"));
const News = lazy(() => import("./pages/admin/scenes/News/News"));
const ViewNews = lazy(() => import("./pages/admin/scenes/ViewNews/ViewNews"));
const AdminPage = lazy(() => import("./pages/admin/admin"));
const Admin = lazy(() => import("./pages/admin/scenes/Manage/Manage"));
const Default = lazy(() => import("./pages/Default"));
const UserProfile = lazy(() => import("./pages/userProfile/UserProfile"))

const App = () => {

  const ROLE_USER = "user";
  const ROLE_ADMIN = "admin";

  const UserRoute = ({ element }) => {
    const roleUser = localStorage.getItem("role").replace(/"/g, "");

    if (roleUser === ROLE_USER) {
      return element;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  };
  
  const AdminRoute = ({ element }) => {
    const roleUser = localStorage.getItem("role")?.replace(/"/g, "");

    if (roleUser === ROLE_ADMIN) {
      return element;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  };

  const AuthRoute = ({ element }) => {
    const token = localStorage.getItem("access_token");

    if (token !== null) {
      return element;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  };


  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* public routes */}
          <Route
            path='/'
            element={
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path='/login'
            element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path='/register'
            element={
              <Suspense fallback={<Loading />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path='/details/:id'
            element={
              <Suspense fallback={<Loading />}>
                <DetailsPages />
              </Suspense>
            }
          />
          <Route
            path='/account'
            element={
              <Suspense fallback={<Loading />}>
                <Account />
              </Suspense>
            }
          />
          <Route
            path='/create'
            element={
              <Suspense fallback={<Loading />}>
                <Create />
              </Suspense>
            }
          />

          {/* customer routes */}
          <Route
            path="/user-profile"
            element={
              <UserRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <UserProfile />
                  </Suspense>
                }
              />
            }
          />

          {/* admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute
                element={
                  <Suspense fallback={<Loading />}>
                    <AdminPage />
                  </Suspense>
                }
              />
            }
          >
            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="user"
              element={
                <Suspense fallback={<Loading />}>
                  <User />
                </Suspense>
              }
            />
            <Route
              path="view_user"
              element={
                <Suspense fallback={<Loading />}>
                  <ViewUser />
                </Suspense>
              }
            />
            <Route
              path="category"
              element={
                <Suspense fallback={<Loading />}>
                  <Category />
                </Suspense>
              }
            />
            <Route
              path="view_category"
              element={
                <Suspense fallback={<Loading />}>
                  <ViewCategory />
                </Suspense>
              }
            />
            <Route
              path="news"
              element={
                <Suspense fallback={<Loading />}>
                  <News />
                </Suspense>
              }
            />
            <Route
              path="view_news"
              element={
                <Suspense fallback={<Loading />}>
                  <ViewNews />
                </Suspense>
              }
            />
            <Route
              path="manage"
              element={
                <Suspense fallback={<Loading />}>
                  <Admin />
                </Suspense>
              }
            />
          </Route>

          {/* Unauthorized Page */}
          <Route
            path="/unauthorized"
            element={
              <Suspense fallback={<Loading />}>
                <Unauthorized />
              </Suspense>
            }
          />

          {/* Not found routes */}
          <Route
            path="*"
            element={
              <Suspense fallback={<Loading />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
}
export default App
