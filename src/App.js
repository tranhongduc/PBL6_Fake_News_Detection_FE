import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./utils/ScrollToTop";
import "react-toastify/dist/ReactToastify.css";
import 'react-lazy-load-image-component/src/effects/blur.css';



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


const App = () => {
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

          {/* admin routes */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loading />}>
                <AdminPage />
              </Suspense>
            }
          >
            <Route index element={<DashBoard/>}/>
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
        </Routes>
      </BrowserRouter>
      {/* <Routes>
        <Route path='/' element={<Default />} >
          <Route index element={<Home />} />
          <Route path='details/:id' element={<DetailsPages />} />
          <Route path='account' element={<Account />} />
          <Route path='create' element={<Create />} />
        </Route>
        <Route path='admin' element={<AdminPage />} >
          <Route index element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path="view_user" element={<ViewUser />} />
          <Route path="category" element={<Category />} />
          <Route path="news" element={<News />} />
          <Route path="manage" element={<Admin />} />
        </Route>
      </Routes> */}
      <ToastContainer />
    </div>
  )
}
export default App
