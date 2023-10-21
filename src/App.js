import React from "react"
import { Home } from "./pages/home/Home"
import { Route, Routes } from "react-router-dom"
import { DetailsPages } from "./pages/details/DetailsPages"
import { Account } from "./pages/account/Account"
import { Create } from "./components/create/Create"
import Default from "./pages/Default"
import AdminPage from "./pages/admin/admin"
import Admin from "./pages/admin/scenes/Admin/Admin"
import News from "./pages/admin/scenes/News/News"
import Category from "./pages/admin/scenes/Category/Category"
import User from "./pages/admin/scenes/User/User"
import ViewUser from "./pages/admin/scenes/ViewUser/ViewUser"
import Team from "./pages/admin/u/team"
import Contacts from "./pages/admin/u/contacts"
import Invoices from "./pages/admin/u/invoices"
// import Bar from "./pages/admin/scenes/bar"
// import Pie from "./pages/admin/scenes/pie/pie"
// import Line from "./pages/admin/scenes/line"
// import FAQ from "./pages/admin/scenes/faq"
// import Geography from "./pages/admin/scenes/geography"
import Dashboard from "./pages/admin/scenes/dashboard/dashboard"

const App = () => {
  return (
        <Routes>
        <Route path='/' element={<Default/>} >
          <Route index element={<Home/>} />
          <Route path='details/:id' element={<DetailsPages/>} />
          <Route path='account' element={<Account/>} />
          <Route path='create' element={<Create/>} />
        </Route>
        <Route path='admin' element={<AdminPage/>} >
          <Route index element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path="view_user" element={<ViewUser />} />
          <Route path="category" element={<Category />} />
          <Route path="news" element={<News />} />
          <Route path="manage" element={<Admin />} />
        </Route>
        </Routes>
  )
}
export default App
