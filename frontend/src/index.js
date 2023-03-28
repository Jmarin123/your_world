import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import RegisterORLogin from './components/RegisterORLogin';
import SplashScreen from './components/SplashScreen';
import HomePage from './components/HomePage';
import './splashpage.css';
import { GlobalStoreContextProvider } from './store'

import Map from './components/Map';


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "registerORlogin",
    element: <RegisterORLogin />,
  },
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/map",
    element: <Map />,
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <GlobalStoreContextProvider>
    <RouterProvider router={router}>
    {/* <RouterProvider router={router2} /> */}
    </RouterProvider>
    </GlobalStoreContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
