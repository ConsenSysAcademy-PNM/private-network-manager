import React from 'react'
import ReactHtmlParser from 'react-html-parser';

import { Table, Segment } from 'semantic-ui-react';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

const highlights = ['INFO', 'number', 'txs', 'hash', 'uncles', 'elapsed'];

const highlightText = (textLine) => {
  let result = textLine;
  highlights.forEach((string) => {
    result = result.split(string).join(`<span class="highlight">${string}</span>`)
  })
  return result;
}

const TerminalLogs = ({ tableData }) => (
  <div>
    <h2>Terminal Output</h2>
    <div id="terminal">
      <Table basic="very" color="black" inverted>
        <Table.Body>
          {tableData.map((obj, index) => (
            <Table.Row key={obj.row}>
              <Table.Cell textAlign="center" width={1}>
                {obj.row}
              </Table.Cell>
              <Table.Cell>
                {ReactHtmlParser(highlightText(obj.text))}
              </Table.Cell>
            </Table.Row>
          )
          )}
        </Table.Body>
      </Table>
    </div>
  </div>
);

export default TerminalLogs
