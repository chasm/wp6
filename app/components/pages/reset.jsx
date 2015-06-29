import React, { Component } from "react"

import { Link } from "react-router"

import { Button, Col, Row, Alert } from "react-bootstrap"

import superagent from "superagent"

import t from "tcomb-form"

let Form = t.form.Form

let User = t.struct({
  email: t.Str
})

let alertInstance = (
  <Alert bsStyle='warning'>
    This email does not exist.
  </Alert>
)

let setResponse = (<p> A mail has been sent to this address, please follow the link to reset your password</p>)

class ResetPage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      user: {}
    }
  }

  handleClick (event) {
    let value = this.refs.loginForm.getValue()

    this.setState({sentMail: true})

    superagent
      .post("/api/reset")
      .send(value)
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) {
          this.setState({ failed: true, email: value.email })
        } else {
          this.setState({ sent: true})
          localStorage.email = value.email
          console.log(res, "response")
          this.context.router.transitionTo("response")
        }
      })
  }

  render () {
    let response = this.state.sent ? setResponse : ""
    let message = this.state.failed ? alertInstance : ""

    let options = {
      fields: {
        email: {
          label: "Email address",
          error: "You must enter a valid email address."
        }
      },
      legend: "Enter your email"
    }

    return <Row>
      <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
        {message}
        <Form ref="loginForm" type={User} options={options} values={this.state.user} />
        {response}
        <Button bsStyle="primary" onClick={this.handleClick.bind(this)}>Reset</Button>
      </Col>
    </Row>
  }

}

ResetPage.contextTypes = {
  router: React.PropTypes.func
}

export default ResetPage
