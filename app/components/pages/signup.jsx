import React, { Component } from "react"

import t from "tcomb-form"

import superagent from "superagent"

import { Button } from "react-bootstrap"

let Form = t.form.Form

let password = t.subtype(t.Str, (pwd) => {
  let r = /^[a-zA-Z]{5,}$/

  return r.test(pwd)
})

let email = t.subtype(t.Str, (e) => {
  let r = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

  return r.test(e)
})

let fullname = t.subtype(t.Str, (name) => {
  let r = /([A-Za-z]{2,})([\s])([A-Za-z]{2,})/

  return r.test(name)
})

let User = t.struct({
  fullname: fullname,
  username: t.Str,
  email: email,
  password: password,
  locale: t.maybe(t.Str)
})

class SignUpPage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      fullname: null,
      username: null,
      email: null,
      password: null,
      locale: null
    }
  }

  save (event) {
    let value = this.refs.form.getValue()

    if (value) {
      console.log(value)
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
          type: "Password",
          error: "Password should be longer than 4 characters."
        },
        locale: {
          placeholder: "Where do you stay..."
        }
      }
    }

    let values = {
      fullname: this.state.fullname,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      locale: this.state.locale
    }

    return (
      <div>
        <Form ref="form" type={User} options={options} values={values} />
        <Button bsStyle="primary" onClick={this.save.bind(this)}>Save</Button>
      </div>
    )
  }
}

export default SignUpPage
