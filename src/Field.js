import React, { Component } from 'react';
import { DropTarget } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import ReactAnimationFrame from 'react-animation-frame';

import { line } from 'd3-shape';
import { max } from 'd3-array';


import './Field.css'


class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {playing: false, frame: 0}
  }

  onAnimationFrame(time){
    if(!this.state.playing || this.state.frame >= max(this.props.matches.map((d) => d.data.length))){
      this.props.endAnimation();
      this.setState({playing: false})
      console.log("Stopped");

    }

    this.setState({frame: (this.state.frame + 2)});
  }

  onPlay = () => {
    this.setState({playing: !this.state.playing, frame: 0});
    this.props.startAnimation()
  }


  render(){
    const { isOver, canDrop, connectDropTarget } = this.props;
    let lineGenerator = line().x((d) => d.x).y((d) => d.y);

    if(this.props.matches && this.props.matches.length > 0){
      return connectDropTarget(
        <div className='Field'>
          <div>
            <svg className='fieldView' viewBox="-1 -1 56 29">
            <rect x='0' y='0' height='27' width='54' rx='.5' ry='.5'/>
              {this.props.matches.map((m) => {
                return (
                  <g className={m.color}>
                  <path className="match" d={lineGenerator(m.data.slice(max([this.state.frame-50, 0]), this.state.frame))} />
                  <path className="match-echo" d={lineGenerator(m.data.slice( 0, this.state.frame))} />
                  <path className={`${this.state.playing?'hide':'match-echo'}`} d={lineGenerator(m.data)} />
                  </g>
                )
              })}
            </svg>
          </div>
          <div>
          <button onClick={this.onPlay}>{this.state.playing?'Stop':'Play'}</button>
          {this.props.matches.map((m, i) => {
              return (
                <div key={i} onClick={() => this.props.onRemoveTeam(i)}>
                {m.team}_{m.matchNo}
                </div>
              )
          })}
          </div>
        </div>
      )

    }
    else
      return connectDropTarget(
        <div className='Field'>
          No Teams
        </div>
      )
  }
}

let fileTarget = {
  drop(props, monitor, component) {
    monitor.getItem().files.map((f) => {
      let r = new FileReader();
        r.onload = function(e) {
          let contents = e.target.result;
          component.props.onDrop(contents);
        }
      r.readAsText(f);
    })


  }

}

let collector = (connect, monitor) => {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

export default DropTarget([NativeTypes.FILE], fileTarget, collector)(ReactAnimationFrame(Field));
