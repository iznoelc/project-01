import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import MainRouter from "./routes/MainRouter.jsx";
import AuthProvider from './contexts/AuthProvider.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(MainRouter);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} fallbackElement={<fallbackElement />} />
    </AuthProvider>
  </StrictMode>,
)
