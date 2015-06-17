import "babel-core/polyfill"

require("./styles/main.less")

import React from "react"

import Router, { HistoryLocation } from "react-router"

import routes from "./routes"

let mountNode = document.getElementById("app")

Router.run(routes, HistoryLocation, function (Handler) {
  React.render(<Handler />, mountNode)
})
