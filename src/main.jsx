import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import MainRouter from "./routes/MainRouter.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(MainRouter);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} fallbackElement={<fallbackElement />} />
  </StrictMode>,
)
