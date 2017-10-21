import React, { Component } from 'react'
import io from 'socket.io-client';

import { Table, Message, Icon } from 'semantic-ui-react';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'


class TerminalLogs extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      data: [],
      connectionStatus: '',
      receivedMessage: '',
    }
    this.startSocket = this.startSocket.bind(this);

  }

  componentDidMount() {
    this.startSocket();
    let data = [];
    for (let i = 0; i < 15; i += 1) {
      data.push(`text line: ${i}`);
    }
    this.setState({ data });
  }

  startSocket() {
    this.socket = io.connect('http://127.0.0.1:5000');

    this.socket.on('connect', () => {
      console.log('** CONNECTED **');
      console.log(this.socket);
      this.setState({ connectionStatus: `Connected to server logs: ` });
    });

    this.socket.on('message', (message) => {
      this.setState({ receivedMessage: JSON.stringify(message) });
    });
  }

  render() {
    const { connectionStatus, receivedMessage } = this.state;
    return (
      <div>
        <h2>Terminal Output</h2>
        {connectionStatus}
        {receivedMessage}
        <Table basic="very">
          <Table.Body>
            {this.state.data.map((value, index) => (
              <Table.Row>
                <Table.Cell width={1}>
                  {index}
                </Table.Cell>
                <Table.Cell>
                  {value}
                </Table.Cell>
              </Table.Row>
            )
            )}
          </Table.Body>
        </Table>

      </div>
    );
  }
}

export default TerminalLogs
