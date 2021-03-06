import React, { Component } from 'react';
import BaseName from './contextMenuInput';
import BaseColor from './contextMenuBaseColor';
import BaseIcon from './contextMenuBaseIcon';
import BaseOptions from './contextMenuBaseOptions';
import './contextMenu.scss';

class ContextMenu extends Component {

  render(){
    return (
      <div>
        <BaseName handleClick = {this.props.handleClick} base = {this.props.base} />
        <BaseColor handleClick = {this.props.handleClick} base = {this.props.base} />
        <BaseIcon handleClick = {this.props.handleClick}  base = {this.props.base} />
        <BaseOptions handleClick = {this.props.handleClick}  
                     base = {this.props.base} teamId={this.props.teamId} 
                     tables={this.props.tables}
                     teamNames={this.props.teamNames}
        />
      </div>
    )
  }
}

export default ContextMenu;