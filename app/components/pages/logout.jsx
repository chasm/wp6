import React, { Component } from "react"

import superagent from "superagent"

class LogoutPage extends Component {

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    superagent
      .del("/api/logout")
      .end((err, res) => {
        if (err) {
          console.log("Error!", err)
        } else {
          delete localStorage.user
          this.context.router.transitionTo("home")
        }
      })
  }

  render () {
    return <div>Logging out!</div>
  }
}

LogoutPage.contextTypes = {
  router: React.PropTypes.func
}

export default LogoutPage
