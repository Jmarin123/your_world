import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthContextProvider } from './auth/index';
import { GlobalStoreContextProvider } from './store'

import Register from './components/Register';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import PublicPage from './components/PublicPage';
import Map from './components/Map';
import HomePage from './components/HomePage';
import Mapview from './components/Mapview';
import AppBanner from './components/AppBanner';
// import RenameModal from './components/RenameModal'
import DeleteModal from './components/DeleteModal'
import ErrorModal from './components/ErrorModal'
import ExportModal from './components/ExportModal'
import SearchPage from './components/SearchPage';
import RenameMapModal from './components/RenameMapModal';
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
const App = () => {
  if (process.env.NODE_ENV === "production") {
    console.log = function () { }
  }
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <AppBanner />
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/public" element={<PublicPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/map/:id" element={<Map />} />
            <Route path="/mapview/:id" element={<Mapview />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/resetpassword' element={<ResetPassword />} />
          </Routes>
          {/* <RenameModal /> */}
          <RenameMapModal />
          <DeleteModal />
          <ErrorModal />
          <ExportModal />

        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App