import React, { Component } from "react"

import superagent from "superagent"

class LogoutPage extends Component {

  constructor (props) {
    super(props)
  }

  static willTransitionTo (transition, params, query, callback) {
    superagent
      .del("/api/logout")
      .end((err, res) => {
        if (err) {
          console.log("Error!", err)
        } else {
          delete localStorage.user
          transition.redirect("/")
          callback()
        }
      })
  }

  render () {
    return <div>Logging out!</div>
  }
}

export default LogoutPage
