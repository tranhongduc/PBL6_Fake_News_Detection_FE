import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./utils/ScrollToTop";
import "react-toastify/dist/ReactToastify.css";
import 'react-lazy-load-image-component/src/effects/blur.css';

const Loading = lazy(() => import("./components/loading/Loading"));
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const DetailsPages = lazy(() => import("./pages/details/DetailsPages"));
const Account = lazy(() => import("./pages/account/Account"));
const Create = lazy(() => import("./components/create/Create"));

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
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default App
