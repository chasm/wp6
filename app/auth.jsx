import React, { Component } from "react"

let auth = {
  loggedIn () {
    let user = localStorage.user ?
      JSON.parse(localStorage.user) :
      false

    return user
  }
}

let requireAuth = (Comp) => {
  return class Authenticated extends Component {
    static willTransitionTo(transition) {
      if (!auth.loggedIn()) {
        transition.redirect("login")
      }
    }

    render () {
      return <Comp {...this.props} />
    }
  }
}

export default requireAuth
