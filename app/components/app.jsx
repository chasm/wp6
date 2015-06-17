import React from "react"

import { RouteHandler, Link } from "react-router"

import Header from "./layouts/header"
import Footer from "./layouts/footer"

class App extends React.Component {

  render () {
    return <div>
      <Header profileLinkName="Cool Link" anotherProp="Yeah!" />
      <main className="container main">
        <RouteHandler />
      </main>
      <Footer />
    </div>
  }
}

export default App
