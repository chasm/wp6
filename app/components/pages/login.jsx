import React, { Component } from "react"

import { Button, Col, Row, Alert } from "react-bootstrap"

import superagent from "superagent"

import t from "tcomb-form"

let Form = t.form.Form

let User = t.struct({
  email: t.Str,
  password: t.Str
})

let alertInstance = (
  <Alert bsStyle='warning'>
    <strong>Crap!</strong> Incorrect email or password.
  </Alert>
)

class LoginPage extends Component {


  constructor (props) {
    super(props)

    this.state = {
      user: {}
    }
  }

  handleClick (event) {
    let value = this.refs.loginForm.getValue()

    superagent
      .post("/api/login")
      .send(value)
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) {
          this.setState({ failed: true, email: value.email })
        } else {
          localStorage.user = res.text
          this.context.router.transitionTo("home")
        }
      })
  }

  render () {
    let message = this.state.failed ? alertInstance : ""

    let options = {
      fields: {
        email: {
          label: "Email address",
          error: "You must enter a valid email address."
        },
        password: {
          label: "Password",
          error: "You must enter a valid password.",
          type: "password"
        }
      },
      legend: "Please sign in"
    }

    return <Row>
      <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
        {message}
        <Form ref="loginForm" type={User} options={options} values={this.state.user} />
        <Button bsStyle="primary" onClick={this.handleClick.bind(this)}>Sign In</Button>
      </Col>
    </Row>
  }
}

LoginPage.contextTypes = {
  router: React.PropTypes.func
}

export default LoginPage
