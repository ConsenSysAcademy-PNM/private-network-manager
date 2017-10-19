import React, { Component } from 'react'

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
      networks: [
        {
          name: 'Network1',
          networkId: 21,
          nodeCount: 5,
          consensus: 'Proof of Work',
          ipAddress: '192.168.121.1',
          status: 'running',
        },
        {
          name: 'Network2',
          networkId: 42,
          nodeCount: 10,
          consensus: 'Proof of Authority',
          ipAddress: '192.168.121.2',
          status: 'stopped',
        },
      ]
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleEditNetworkDetails = this.handleEditNetworkDetails.bind(this);
  }

  componentDidMount() {
  }

  handleChange(e, data) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleStartStop(value) {
    console.log(value);
  }

  handleEditNetworkDetails(network) {
    console.log(network);
  }

  getState() {
    
  }

  render() {
    return (
      <div>
        <h2>Available Networks</h2>
        <Table>
          <Table.Header>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Network ID</Table.HeaderCell>
            <Table.HeaderCell>Number of Nodes</Table.HeaderCell>
            <Table.HeaderCell>Consensus</Table.HeaderCell>
            <Table.HeaderCell>IP Address</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {this.state.networks.map(network =>
              <NetworkStatusRow
                network={network}
                handleStartStop={this.handleStartStop}
                handleEditNetworkDetails={this.handleEditNetworkDetails}
              />)}
          </Table.Body>
        </Table>

      </div>
    );
  }
}

export default NetworkStatusTable
