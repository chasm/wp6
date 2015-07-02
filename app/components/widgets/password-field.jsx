import React, { Component } from "react"

import { Button, Glyphicon, Input } from "react-bootstrap"

import classNames from "classnames"

import t from "tcomb-form"
let Form = t.form.Form

import { t as T } from "tcomb-react"

let pw = (locals) => {

  let formGroupClasses = {
    "form-group": true,
    "has-feedback": true,
    "has-error": locals.hasError
  }

  // config contains your new params
  let config = locals.config || {}

  let innerButton = <Button>
    <Glyphicon glyph={locals.inputIcon} onClick={locals.togglePassword} />
  </Button>

  return (
    <div className={classNames(formGroupClasses)}>

      {/* add a label if specified */}
      {locals.label ? <label className="control-label">{locals.label}</label> : null}

      <Input type={locals.inputType} buttonAfter={innerButton}
        value={locals.value} onChange={locals.onChange}
        name={locals.name} />

      {/* add an error if specified */}
      {locals.error ? <span className="help-block error-block">{locals.error}</span> : null}

      {/* add a help if specified */}
      {locals.help ? <span className="help-block">{locals.help}</span> : null}

    </div>
  )
}

class PasswordField extends Component {

  constructor (props) {
    super(props)

    this.state = {
      hasError: false,
      value: this.props.value,
      name: this.props.options.name || this.props.ctx.name,
      inputType: "password",
      inputIcon: "eye-open"
    }
  }

  componentWillReceiveProps (props) {
    this.setState({value: props.value})
  }

  onChange (value) {
    this.setState({ value: value })
    this.props.onChange(value)
  }

  getValue () {
    let value = this.state.value
    let result = T.validate(value, this.props.ctx.report.type)

    this.setState({hasError: !result.isValid()})
    return result
  }

  togglePassword (event) {
    let status = this.state.inputType === "password"

    this.setState({
      inputType: status ? "text" : "password",
      inputIcon: status ? "eye-close" : "eye-open"
    })
  }

  render () {
    let opts = this.props.options || {}
    let ctx = this.props.ctx

    // handling label
    let label = opts.label

    // handling placeholder
    let placeholder = null

    // labels have higher priority
    if (!label && ctx.auto !== "none") {
      placeholder = !T.Nil.is(opts.placeholder) ? opts.placeholder : label
    }

    // handling name attribute
    let name = opts.name || ctx.name

    let value = this.state.value

    // handling error message
    let error = T.Func.is(opts.error) ? opts.error(this.state.value) : opts.error

    // using the custom template defined above
    return pw({
      config: opts.config,
      disabled: opts.disabled,
      error: error,
      hasError: this.state.hasError,
      help: opts.help,
      label: label,
      name: name,
      placeholder: placeholder,
      value: this.state.value,
      inputType: this.state.inputType,
      inputIcon: this.state.inputIcon,
      togglePassword: this.togglePassword.bind(this)
    })
  }
}

export default PasswordField
