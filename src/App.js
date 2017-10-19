import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'

import { Table, Form, Button, Radio, Dropdown } from 'semantic-ui-react';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      networkid: '',
      nodecount: '',
      consensus: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.createNetwork = this.createNetwork.bind(this);
  }

  handleChange(e, data) {
    console.log(e, data);
    this.setState({ [e.target.name]: e.target.value });
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  createNetwork() {
  //   exec('~/Documents/12launch.sh',
  //   function (error, stdout, stderr) {
  //     console.log('stdout: ' + stdout);
  //     console.log('stderr: ' + stderr);
  //     if (error !== null) {
  //       console.log('exec error: ' + error);
  //     }
  // });
  }

  render() {

    const { consensus } = this.state;

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">ConsenSys Academy Hackathon 2017</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Private Network Manager</h1>
              <p>#CADhackDXB</p>
              <h2>Input Network Parameters</h2>
              <Form>
                <Form.Input
                  label="Name"
                  value={this.state.name}
                  name="name"
                  onChange={this.handleChange}
                  placeholder="Enter new network name"
                />
                <Form.Input
                  label="Network ID"
                  placeholder="Enter network id"
                  value={this.state.networkid}
                  name="networkid"
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Number of Nodes"
                  placeholder="Enter number of nodes"
                  value={this.state.nodecount}
                  name="nodecount"
                  onChange={this.handleChange}
                />
                <Form.Group inline>
                  <label>Consensus Methodology</label>
                  <Form.Field control={Radio} label="Proof of Work" name="consensus" value="pow" checked={consensus === 'pow'} onChange={this.handleChange} />
                  <Form.Field control={Radio} label="Proof of Authority" name="consensus" value="poa" checked={consensus === 'poa'} onChange={this.handleChange} />
                </Form.Group>
                <Button onClick={this.createNetwork}>Create new private network</Button>
              </Form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
