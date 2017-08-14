import React, {Component} from 'react';
import { connect } from 'react-redux';
import BaseItem from '../homePageBase/homePageBaseItem';
import HomePageTeamName from './homePageTeamName';
import { addNewBase } from '../homePageActions';
import { showContextMenu } from '../homePageActions';
import { Icon } from 'semantic-ui-react';
import './homePageTeam.scss';


class BaseList extends Component {
  constructor(props) {
    super(props);
    const onMenuClick = props.onMenuClick;
    console.log(props)
  }
  render() {
    const props = this.props;  
      return (
        <div className = 'base-list '  >
          { this.props.bases.map(function(base, current) {
            return (
              <div key = {base.id}>
                <BaseItem className = "base-list-item"  
                    handleClick = {props.handleClick}  
                    base = {base}
                />
              </div>
           )}) 
          }
        </div>
      )
    }
}

export default BaseList
