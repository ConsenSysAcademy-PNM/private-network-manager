import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import axios from 'axios';

import { Table, Form, Button, Radio, Dropdown, Segment } from 'semantic-ui-react';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

import NetworkStatusTable from './components/NetworkStatusTable';

var fs = require('fs');

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      networkId: '',
      nodeCount: '',
      consensus: 'pow',
      genesisData: '',
      getRequestMessage: '',
      postRequestMessage: '',
      createNetworkMessage: '',
      blockTime: '',
      networks: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleRadioSelection = this.handleRadioSelection.bind(this);
    this.createNetwork = this.createNetwork.bind(this);
    this.exampleGetRequest = this.exampleGetRequest.bind(this);
    this.examplePostRequest = this.examplePostRequest.bind(this);
  }

  handleChange(e, data) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleRadioSelection(e, data) {
    this.setState({ consensus: data.value });
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


  componentDidMount() {
    axios.get('/get_state')
      .then(response => this.setState({ networks: response.data }))
      .catch(err => console.log(err));
  }


  createNetwork() {

    console.log('Create network');
    this.setState({ createNetworkMessage: '' });
    const {networks,  name, networkId, consensus, nodeCount } = this.state;
    const params = { name, networkId, consensus, nodeCount };
   
    axios.post(`/create_geth_${consensus}`, params)
      .then(response => this.setState({ createNetworkMessage: response.data }))
      .catch(err => this.setState({ createNetworkMessage: err.toString() }));

      networks[name]  = {"name":name, "networkId": networkId, "consensus":consensus,
                           "nodeCount":nodeCount, "ipAddress":"",
                          status:"stopped"}

      this.setState({networks :networks })

      axios.post('/save_state', {networks})
      .then(response => this.setState({ postRequestMessage: response.data }))
      .catch(err => this.setState({ postRequestMessage: err.toString() }));
  }

  exampleGetRequest() {
    axios.get('/getExample')
      .then(response => this.setState({ getRequestMessage: response.data }))
      .catch(err => this.setState({ getRequestMessage: err.toString() }));
  }

  examplePostRequest() {

    const { name, networkId, nodeCount, consensus } = this.state;

    const params = {
      name,
      networkId,
      nodeCount,
      consensus,
    }

    axios.post('/postExample', params)
      .then(response => this.setState({ postRequestMessage: response.data }))
      .catch(err => this.setState({ postRequestMessage: err.toString() }));
  }

  render() {
    const { consensus, networks } = this.state;
    
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

              <NetworkStatusTable networks={this.state.networks} />              

              <h2>Create a New Network: Input Network Parameters</h2>
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
                  value={this.state.networkId}
                  name="networkId"
                  onChange={this.handleChange}
                />
                <Form.Input
                  label="Number of Nodes"
                  placeholder="Enter number of nodes"
                  value={this.state.nodeCount}
                  name="nodeCount"
                  onChange={this.handleChange}
                />
                <Form.Group inline>
                  <label>Consensus Methodology</label>
                  <Form.Field control={Radio} label="Proof of Work" name="consensus" value="pow" checked={consensus === 'pow'} onChange={this.handleRadioSelection} />
                  <Form.Field control={Radio} label="Proof of Authority" name="consensus" value="poa" checked={consensus === 'poa'} onChange={this.handleRadioSelection} />
                </Form.Group>
                {consensus === 'poa' && (
                  <Form.Input
                    label="Block time in seconds"
                    placeholder="Default = 15"
                    value={this.state.blockTime}
                    name="blockTime"
                    onChange={this.handleChange}
                  />
                )}
                <Form.Input
                  label="Genesis data: input hex"
                  placeholder="Enter data to be included in genesis file"
                  value={this.state.genesisData}
                  name="genesisData"
                  onChange={this.handleChange}
                />
                <Button onClick={this.createNetwork}>Create new private network</Button>
                {this.state.createNetworkMessage}
              </Form>

              <Segment>              
                <h2>Development Area | Testing</h2>
                
                <Button onClick={this.exampleGetRequest}>Get request</Button>
                {this.state.getRequestMessage}

                <br />
                <br />

                <Button onClick={this.examplePostRequest}>Post request</Button>
                {this.state.postRequestMessage}
              </Segment>  
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
