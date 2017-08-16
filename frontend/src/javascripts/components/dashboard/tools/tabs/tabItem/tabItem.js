import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router';
import R from 'ramda';

import TabPopup from './tabPopup/tabPopup';
import './tabItem.scss';

let currentTable;

const TabItem = (base, currentTableId, table, switchTableClick, openMenu,
                 closeMenu, activeModal, setTabsModal, tables, checkRenameInput, renameIsError) => (
    <div className='tab_btn' key={table._id}>
        <Link to={`/dashboard/${base._id}/${table._id}`}>
            <Button inverted
                active={table.isActive}
                onContextMenu={(evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    currentTable = table;
                    openMenu(table._id);
                }}
                onClick={() => {
                    closeMenu();
                    switchTableClick(table._id);} }>
                {table.name}
            </Button>
        </Link>
        <TabPopup renameIsError={renameIsError}
                  checkRenameInput={checkRenameInput}
                  isOpen={table.isMenuOpen}
                  activeModal={activeModal}
                  setTabsModal={setTabsModal}
                  tables={tables}
                  table={currentTable ? currentTable : table}/>
    </div>

);

export default TabItem;