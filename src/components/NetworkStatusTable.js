import React, { Component } from 'react'
import axios from 'axios'
import { Table, Form, Button, Dropdown } from 'semantic-ui-react';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

import NetworkStatusRow from './NetworkStatusRow';

class NetworkStatusTable extends Component {
  constructor(props) {
    super(props)

    
    this.state = {
      networks: {},
      statusMessage: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleEditNetworkDetails = this.handleEditNetworkDetails.bind(this);
  }


  handleChange(e, data) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleStartStop(params) {
    if (params === 'stop') {
      axios.post('/geth/network/stop')
        .then((statusMessage) => {
          this.setState({ statusMessage: statusMessage.data.message });
          this.props.updateNetworksStatus();
        })
        .catch(err => this.setState({ statusMessage: `Error: ${err}` }));
    } else {
      axios.post(`/geth/network/${params.networkId}/start`, params)
        .then((statusMessage) => {
          this.setState({ statusMessage: statusMessage.data.message });
          let i = 0;
          let interval = setInterval(() => {
            console.log('check');
            this.props.updateNetworksStatus();
            if (i > 5 || this.props.networks[params.name].status === 'running') clearInterval(interval);
            i += 1;
          }, 1000);
        })
        .catch((err) => {
          this.setState({ statusMessage: `Error: ${err}` });
        });
    }
  }

  handleEditNetworkDetails(network) {
    console.log(network);
  }

  render() {
    const { networks } = this.props;
    return (
      <div>
        <h2>Available Networks</h2>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Network ID</Table.HeaderCell>
              <Table.HeaderCell>Number of Nodes</Table.HeaderCell>
              <Table.HeaderCell>Consensus</Table.HeaderCell>
              <Table.HeaderCell>IP Address</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.keys(networks).map(name =>
              <NetworkStatusRow
                key={name}
                network={networks[name]}
                handleStartStop={this.handleStartStop}
                handleEditNetworkDetails={this.handleEditNetworkDetails}
              />)}
          </Table.Body>
        </Table>
        {this.state.statusMessage}

      </div>
    );
  }
}

export default NetworkStatusTable
