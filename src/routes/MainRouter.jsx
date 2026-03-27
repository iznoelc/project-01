import React from "react";

import PrivateRoute from "./PrivateRoute";
import Home from "../components/Home";
import Root from "../layout/Root";
import FallbackElement from "../components/FallbackElement";
import SignUpPage from "../components/SignUpPage";
import LoginPage from "../components/LoginPage";
import MessagesPage from "../components/MessagesPage";
import WeatherPage from "../components/WeatherPage";
import ToDoPage from "../components/ToDoPage";
import ForgotPasswordPage from "../components/ForgotPasswordPage";
import ErrorPage, { ErrorBoundary } from "../components/ErrorPage";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorBoundary,
    children: [
      { index: true,
        Component: Home,
        // loader: movieDataLoader
        HydrateFallback: FallbackElement },
      { path: "signup", Component: SignUpPage },
      { path: "login", Component: LoginPage },
      { path: "messages",
        element: (
          <PrivateRoute>
            <MessagesPage></MessagesPage>
          </PrivateRoute>
          ), },
      { path: "weather",
        element: (
          <PrivateRoute>
            <WeatherPage></WeatherPage>
          </PrivateRoute>
          ), },
      { path: "todo",
        element: (
          <PrivateRoute>
            <ToDoPage></ToDoPage>
          </PrivateRoute>
        ),
       },
      { path: "forgotpassword", Component: ForgotPasswordPage},
      { path: "error", Component: ErrorPage },
    ],
  },
];

export default MainRouter;