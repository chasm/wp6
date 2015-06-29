import React, { Component } from "react"

class ResponsePage extends Component {
  render () {
    return <div style={{textAlign: "center"}}>
      <p style={{fontSize: 18}}>An email has been sent to <span style={{color: "blue"}}>{localStorage.email}</span>. Please follow the link to reset your password</p>
    </div>
  }

}

if(delete localStorage.email) {
  console.log("true")
}

export default ResponsePage
