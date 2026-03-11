import React from "react";

import Home from "../components/Home";
import Root from "../layout/Root";
import FallbackElement from "../components/FallbackElement";
import SignUpPage from "../components/SignUpPage";
import LoginPage from "../components/LoginPage";
import MessagesPage from "../components/MessagesPage";
import WeatherPage from "../components/WeatherPage";
import ToDoPage from "../components/ToDoPage";
import ForgotPasswordPage from "../components/ForgotPasswordPage";


const MainRouter = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,
        Component: Home,
        // loader: movieDataLoader
        HydrateFallback: FallbackElement },
      { path: "signup", Component: SignUpPage },
      { path: "login", Component: LoginPage },
      { path: "messages", Component: MessagesPage },
      { path: "weather", Component: WeatherPage },
      { path: "todo", Component: ToDoPage },
      { path: "forgotpassword", Component: ForgotPasswordPage},
    ],
  },
];

export default MainRouter;