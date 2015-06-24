import React, { Component } from "react"

import { Button } from "react-bootstrap"

import superagent from "superagent"

import t from "tcomb-form"

let Form = t.form.Form

let ISBN = t.subtype(t.Str, (s) => {
  let r = /^(97(8|9)\-?)?\d{9}(\d|X)$/

  return r.test(s)
})

let Book = t.struct({
  isbn: ISBN
})

class BooksPage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      isbn: null
    }
  }

  handleClick (event) {
    let value = this.refs.bookForm.getValue()

    superagent
      .post("/api/books")
      .send(value)
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) {
          console.log("Error!", err)
          this.setState({ failed: true, isbn: value.isbn })
        } else {
          this.setState({ success: true })
          console.log("Response", res)
        }
      })
  }

  render () {
    let message = this.state.failed ?
      <p>Could not find book! Try again?</p> :
      ""

    let options = {
      fields: {
        isbn: {
          label: "ISBN",
          placeholder: "Enter the 10 or 13-digit ISBN",
          error: "You must enter a valid ISBN."
        }
      }
    }

    let values = {
      isbn: this.state.isbn
    }

    return <div>
      {message}
      <Form ref="bookForm" type={Book} options={options} values={values} />
      <Button bsStyle="primary" onClick={this.handleClick.bind(this)}>Add Book</Button>
    </div>
  }
}

BooksPage.contextTypes = {
  router: React.PropTypes.func
}

export default BooksPage
