import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd';





import Field from './Field';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {matches: []}
  }

  onDrop= (contents) => {
    let lines = contents.split("\n");
    let metaData = lines.splice(0,1)[0].split(",");
    let data = lines.map((l) => l.split(","));
    data = data.map((row) => {
      return {
        x: parseFloat(row[0]),
        y: parseFloat(row[1]),
        t: parseFloat(row[2]),
      }
    })

    let matches = this.state.matches;
    let match = {
      team: metaData[0],
      matchNo: metaData[1],
      color: data[0].x < 20 ? 'red' : 'blue',
      data
    }
    matches.push(match);
    this.setState({matches})

  }

  onRemoveTeam = (index) => {
    let matches = this.state.matches;
    matches.splice(index, 1);
    this.setState({matches})
  }

  render() {
    return (
      <div className="App">
        <Field matches={this.state.matches} onDrop={this.onDrop} onRemoveTeam={this.onRemoveTeam}/>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
