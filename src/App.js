import React from "react"
import { Home } from "./pages/home/Home"
import { Route, Routes } from "react-router-dom"
import { DetailsPages } from "./pages/details/DetailsPages"
import { Account } from "./pages/account/Account"
import { Create } from "./components/create/Create"
import Default from "./pages/Default"
import AdminPage from "./pages/admin/admin"
import Team from "./pages/admin/scenes/team"
import Contacts from "./pages/admin/scenes/contacts"
import Invoices from "./pages/admin/scenes/invoices"
import Bar from "./pages/admin/scenes/bar"
import Pie from "./pages/admin/scenes/pie"
import Line from "./pages/admin/scenes/line"
import FAQ from "./pages/admin/scenes/faq"
import Geography from "./pages/admin/scenes/geography"
import Dashboard from "./pages/admin/scenes/dashboard"

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
          <Route path="team" element={<Team />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="bar" element={<Bar />} />
          <Route path="pie" element={<Pie />} />
          <Route path="line" element={<Line />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="geography" element={<Geography />} />
        </Route>
        </Routes>
  )
}
export default App
