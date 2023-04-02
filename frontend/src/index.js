import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import Register from './components/Register';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import './splashpage.css';
import { GlobalStoreContextProvider } from './store'
import { AuthContextProvider } from './auth'

import Map from './components/Map';


import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthContextProvider />}>
    <Route element={<GlobalStoreContextProvider />}>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/map" element={<Map />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* More Routes here... */}
    </Route>
    </Route>
  ));


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
    {/* <RouterProvider router={router2} /> */}
  </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
