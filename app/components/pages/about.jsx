import React, { Component } from "react"

import { Button } from "react-bootstrap"

import { trainify } from "../../utilities"

class AboutPage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      pirate: false
    }
  }

  togglePirate () {
    this.setState({
      pirate: !this.state.pirate
    })
  }

  render () {
    let x = trainify("THIS IS some WeIrD tExT.")

    let pretext = this.state.pirate ?
      "The pirate speaks,\"grog, if you be seekin' t' truth, be better than a " +
      "lie detector. It encourages a man t' be expansive, even reckless, while " +
      "lie detectors be only a challenge t' tell lies successfully.\""
    :
      "Champagne, if you are seeking the truth, is better than a lie detector. " +
      "It encourages a man to be expansive, even reckless, while lie detectors " +
      "are only a challenge to tell lies successfully."

    return <div>
      <form>
        <div className="form-group">
          <label htmlFor="quote">{x}</label>
          <textarea type="text" id="quote" name="quote"
            placeholder="Add your quotation" className="form-control" value={ pretext }></textarea>
        </div>
        <div className="form-group">
          <Button bsStyle="success" onClick={this.togglePirate.bind(this)}>Save It</Button>
        </div>
      </form>
    </div>
  }
}

export default AboutPage
