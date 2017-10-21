import React, { Component } from 'react'
import axios from 'axios'
import { Table, Form, Button, Dropdown, Message, Icon } from 'semantic-ui-react';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

import NetworkStatusRow from './NetworkStatusRow';

class NetworkStatusTable extends Component {
  constructor(props) {
    super(props)

    
    this.state = {
      statusMessage: '',
      selectedNetwork: '',
      action: '',
      running: false,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleEditNetworkDetails = this.handleEditNetworkDetails.bind(this);
    this.resetState = this.resetState.bind(this);
    this.checkNetworksStatus = this.checkNetworksStatus.bind(this);
  }

  componentWillReceiveProps() {
    this.checkNetworksStatus();
  }
  
  checkNetworksStatus() {
    const { networks } = this.props;
    Object.keys(networks).map((network) => {
      console.log(networks[network].status);
      if (networks[network].status === 'running') {
        this.setState({ running: true });
      }
    })
  }

  handleChange(e, data) {
    this.setState({ [e.target.name]: e.target.value });
  }

  resetState() {
    this.setState({ statusMessage: '', selectedNetwork: '', action: '', running: false }, this.checkNetworksStatus)
  }

  handleStartStop(params) {
    if (params === 'stop') {
      axios.post('/geth/network/stop')
        .then((statusMessage) => {
          console.log('**** STOP ');
          this.setState({
            statusMessage: statusMessage.data.message,
            action: 'stop',
            running: false,
          });
          this.props.updateNetworksStatus();
          setTimeout(this.resetState, 3000);
        })
        .catch(err => this.setState({ statusMessage: `Error: ${err}` }));
      } else {
        axios.post(`/geth/network/${params.networkId}/start`, params)
        .then((statusMessage) => {
          this.setState({ statusMessage: statusMessage.data.message, selectedNetwork: params.name, action: 'starting' });
          let i = 0;
          let interval = setInterval(() => {
            console.log('check');
            this.props.updateNetworksStatus();
            if (i > 5 || this.props.networks[params.name].status === 'running') {
              clearInterval(interval);
              this.setState({ action: 'start' })
              setTimeout(this.resetState, 3000);
            }
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
                running={this.state.running}
              />)}
          </Table.Body>
        </Table>
        {this.state.statusMessage !== '' && (
          <Message
            positive={this.state.action === 'start'}
            warning={this.state.action === 'starting'}
            icon={this.state.action === 'starting'}
            negative={this.state.action === 'stop'}
          >
            {this.state.action === 'starting' && (
              <Icon name='circle notched' loading />
            )}  
            <Message.Content>
              <Message.Header>Network: {this.state.selectedNetwork}</Message.Header>
              <p>Network {this.state.action === 'stop' ? 'stopped' : this.state.action === 'start' ? 'started' : 'starting'}</p>
            </Message.Content>
          </Message>
        )}

      </div>
    );
  }
}

export default NetworkStatusTable
