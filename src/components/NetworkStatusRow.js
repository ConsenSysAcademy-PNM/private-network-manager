import React, { Component } from 'react'

import { Table, Button } from 'semantic-ui-react';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

const NetworkStatusRow = ({ network, handleStartStop, handleEditNetworkDetails }) => {

  const { name, networkId, nodeCount, consensus, ipAddress, status } = network;

  return (
    <Table.Row>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{networkId}</Table.Cell>
      <Table.Cell>{nodeCount}</Table.Cell>
      <Table.Cell>{consensus}</Table.Cell>
      <Table.Cell>{ipAddress}</Table.Cell>
      <Table.Cell>{status === 'running' ? '✅' : '🔴'}{' '}{status}</Table.Cell>
      <Table.Cell>
        <Button
          positive={status !== 'running'}
          negative={status === 'running'}
          onClick={() => handleStartStop(status === 'running' ? 'stop' : 'start')}
        >{status === 'running' ? 'Stop' : 'Start'}</Button>
        <Button
          onClick={() => handleEditNetworkDetails(name)}
        >Edit Details</Button>
      </Table.Cell>
    </Table.Row>
  );
}

export default NetworkStatusRow;
