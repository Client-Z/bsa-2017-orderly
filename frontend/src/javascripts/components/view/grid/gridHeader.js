import React, {Component} from 'react';
import {Icon, Button} from 'semantic-ui-react';
import {viewIcons} from '../../configuration/viewTypes';
import Search from '../Components/search';
import FilterMenu from './headerMenu/filterMenu';
import SortMenu from './headerMenu/sortMenu';
import ExtraMenu from './headerMenu/extraMenu';
import PopupHideColumn from './headerMenu/hideMenu';
import './gridHeader.scss';

export default class GridHeader extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let _this = this;
        window.addEventListener("keydown",function (e) {
            if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
                e.preventDefault();
                _this.props.onToggleSearch();
            }
        });
    }

    render() {
        return (
            <div className="view__header">
                <div id="header__view-type">
                    <Icon name={viewIcons.grid} id="view-type__icon" size="large"/>
                    <span id="view-type__name">Grid View</span>
                    <Button.Group>
                        <PopupHideColumn
	                        isReadOnly={this.props.isReadOnly}
                            currentViewId={this.props.currentViewId}
                            currentTable={this.props.currentTable}
                            updateViewHideField={this.props.updateViewHideField}
                        />
                        <FilterMenu
	                        isReadOnly={this.props.isReadOnly}
	                        currentTable={this.props.currentTable}
                            currentViewType={this.props.currentViewType}
                            addFilter={this.props.addFilter}
                            updateFilter={this.props.updateFilter}
                            removeFilter={this.props.removeFilter}
                            removeAllFilters={this.props.removeAllFilters}
                        />
                        <SortMenu
	                        isReadOnly={this.props.isReadOnly}
	                        currentTable={this.props.currentTable}
                            currentViewType={this.props.currentViewType}
                            addSort={this.props.addSort}
                            updateSort={this.props.updateSort}
                            removeSort={this.props.removeSort}
                            removeAllSorts={this.props.removeAllSorts}
                        />
                        <ExtraMenu
	                        isReadOnly={this.props.isReadOnly}
                            currentViewType={this.props.currentViewType}
                            currentViewId={this.props.currentViewId}
	                        currentTableId={this.props.currentTable._id}
                            tables={this.props.tables}
                            deleteView={this.props.deleteView}
                            viewsCount={this.props.viewsCount}
                        />
                    </Button.Group>
                </div>
                <div id="search-wrapper">
                    <span id="search-container">
                        {this.props.searchBlockOpen &&
                        <Search onChangeSearch={this.props.onChangeSearch}
                                currentTableId={this.props.currentTableId}
                                searchMatchedRecordItemIdList={this.props.searchMatchedRecordItemIdList}
                                searchFoundIndex={this.props.searchFoundIndex}
                                onChangeSearchFoundIndex={this.props.onChangeSearchFoundIndex}
                                onToggleSearch={this.props.onToggleSearch}/>}
                    </span>
                    <Button
                        className="search-btn"
                        onClick={() => this.props.onToggleSearch()}>
                        <Icon name="search"/>
                    </Button>
                </div>
            </div>
        );
    }
}
