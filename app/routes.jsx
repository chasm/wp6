import React from "react"

import { DefaultRoute, Route } from "react-router"

import App from "./components/app"
import HomePage from "./components/pages/home"
import AboutPage from "./components/pages/about"

let routes = (
  <Route handler={App} path="/">
    <DefaultRoute name="home" handler={HomePage} />
    <Route name="about" handler={AboutPage} />
  </Route>
)

export default routes
