import React from "react"

import { RouteHandler, Link } from "react-router"

import Header from "./layouts/header"
import Footer from "./layouts/footer"

import { Grid } from "react-bootstrap"

class App extends React.Component {

  render () {
    return <div>
      <Header profileLinkName="Cool Link" anotherProp="Yeah!" />
      <Grid className="main">
        <RouteHandler />
      </Grid>
      <Footer />
    </div>
  }
}

export default App
