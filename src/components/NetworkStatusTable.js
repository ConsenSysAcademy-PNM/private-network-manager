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
      networks: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleEditNetworkDetails = this.handleEditNetworkDetails.bind(this);
  }


  handleChange(e, data) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleStartStop(value) {
    console.log(value);
  }

  componentWillMount() {
    this.setState({networks:this.props.networks});
  }

  handleEditNetworkDetails(network) {
    console.log(network);
  }

  render() {

    const { networks } = this.state;
    console.log(networks)
    console.log(this.props)
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
            {Object.keys(networks).map(name =>
              <NetworkStatusRow
                network={networks[name]}
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
