// import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import Register from './components/Register';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import Map from './components/Map';
import YourMaps from './components/YourMaps';
import Mapview from './components/Mapview';
import AppBanner from './components/AppBanner';
import Statusbar from './components/Statusbar';
import RenameModal from './components/RenameModal'
import DeleteModal from './components/DeleteModal'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <GlobalStoreContextProvider>
          <AppBanner />
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/map" element={<Map />} />
            <Route path="/yourmaps" element={<YourMaps />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mapview" element={<Mapview />} />
          </Routes>
          <Statusbar />
          <RenameModal/>
          <DeleteModal />
          {/* <MUIErrorModal /> */}
          {/* <MUIAlertModal /> */}
          {/* <MUIRemoveSongModal /> */}

        </GlobalStoreContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App