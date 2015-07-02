import React, { Component } from "react"

import t from "tcomb-form"

import superagent from "superagent"

import { Button, Col, Grid, Row } from "react-bootstrap"

import { v4 } from "slugid"

let Form = t.form.Form

let password = t.subtype(t.Str, (pwd) => {
  return pwd.length > 4
})

let email = t.subtype(t.Str, (e) => {
  let r = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

  return r.test(e)
})

let fullname = t.subtype(t.Str, (name) => {
  let r = /^([A-Z]{2,})([\s]([A-Z]{2,})){1,}$/i

  return r.test(name)
})

let User = t.struct({
  fullname: fullname,
  username: t.Str,
  email: email,
  password: password,
  locale: t.maybe(t.Str),
  nobot: t.maybe(t.Str)
})

class SignUpPage extends Component {

  constructor (props) {
    super(props)

    this.id = v4()

    this.state = {
      signup: {
        fullname: "Joe Mama",
        username: "JM",
        email: "joe@mama.com",
        password: "xxxxxx",
        locale: "Here"
      }
    }
  }

  save (event) {
    let value = this.refs.form.getValue()

    if (value && !value.nobot) {
      this.setState({
        signup: value
      })

      superagent
        .put(`/signup/${this.id}`)
        .send(value)
        .type("application/json")
        .end((err, res) => {
          if (err) {
            throw err
          }

          this.context.router.transitionTo("home")
        })
    }
  }

  render () {
    let options = {
      fields: {
        fullname: {
          label: "Fullname",
          error: "You must enter full name."
        },
        username: {
          label: "Username",
          error: "Enter a username."
        },
        email: {
          label: "Email",
          error: "Enter a valid email address."
        },
        password: {
          label: "Password",
          error: "Password should be longer than 4 characters.",
          type: "password"
        },
        locale: {
          attrs: {
            placeholder: "Where do you stay..."
          }
        },
        nobot: {
          label: "Are you real?",
          attrs: {
            placeholder: "Leave me blank to prove you understand"
          }
        }
      },
      legend: "Sign up for Quoth!"
    }

    return (
      <Row>
        <Col xs={10} xsOffset={1} sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
          <Form ref="form" type={User} options={options} value={this.state.signup} />
          <Button bsStyle="primary" onClick={this.save.bind(this)}>Sign Up</Button>
        </Col>
      </Row>
    )
  }
}

SignUpPage.contextTypes = {
  router: React.PropTypes.func
}

export default SignUpPage
