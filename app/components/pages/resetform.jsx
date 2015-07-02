import React, { Component } from "react"

import superagent from "superagent"

import { Button, Col, Row, Alert } from "react-bootstrap"

import t from "tcomb-form"

let Form = t.form.Form

let password = t.subtype(t.Str, (pwd) => {
  return pwd.length > 4
})

let Password = t.struct({
  password: password
})


class ResetFormPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      password: {}
    }

    this.id = props.params.id
  }

  handleClick (event) {
    let value = this.refs.ResetPwdForm.getValue()

    this.setState({
      signup: value
    })

    console.log(this.id)

    superagent
      .put(`/api/reset/${this.id}`)
      .send(value)
      .type("application/json")
      .end((err, res) => {
        if (err) {
          throw err
        } else {
          console.log(res.text, "response")
          // this.context.router.transitionTo("home")
        }
      })
  }


  render () {
    let options = {
      fields: {
        password: {
          label: "Password",
          error: "Password should be longer than 4 characters.",
          type: "password"
          // factory: PasswordField.bind(this)
        }
      },
      legend: "Type in a new password"
    }

    return <Row>
      <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
        <Form ref="ResetPwdForm" type={Password} options={options} value={this.state.password} />
        <Button bsStyle="primary" onClick={this.handleClick.bind(this)}>Reset</Button>
      </Col>
    </Row>
  }
}

// ResetFormPage.contextTypes = {
//   router: React.PropTypes.func
// }

export default ResetFormPage
