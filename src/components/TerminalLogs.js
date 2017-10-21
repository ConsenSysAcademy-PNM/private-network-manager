import React, { Component } from 'react'
import io from 'socket.io-client';

import { Table, Message, Icon } from 'semantic-ui-react';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

let i = 0;

class TerminalLogs extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      tableData: [],
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
    // this.socket = io.connect('http://127.0.0.1:8080');
    this.socket = new WebSocket('ws://localhost:8080');

    // this.socket.on('connect', () => {
    this.socket.addEventListener('open', (event) => {
      console.log('** CONNECTED **');
      console.log(this.socket);
      this.setState({ connectionStatus: `Connected to server logs: ` });
    });

    // this.socket.on('message', (message) => {
    this.socket.addEventListener('message', (message) => {

      setTimeout(() => {
        const text = message.data.split('[32m').join(' ').split('[0m').join(' ');
        const row = i;
        i += 1;
        
        let newData = this.state.tableData.slice(0);
        newData.push({ row, text })
  
        this.setState({ receivedMessage: message.data.split('[32m').join(' ').split('[0m').join(' '), tableData: newData });
      }, 0);
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
            {this.state.tableData.map((obj, index) => (
              <Table.Row key={obj.row}>
                <Table.Cell width={1}>
                  {obj.row}
                </Table.Cell>
                <Table.Cell>
                  {obj.text}
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
