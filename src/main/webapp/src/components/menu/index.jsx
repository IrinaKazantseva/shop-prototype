import React from 'react';

import IconMenu from './../../../node_modules/material-ui/IconMenu';
import MenuItem from './../../../node_modules/material-ui/MenuItem';
import IconButton from './../../../node_modules/material-ui/IconButton';
import MoreVertIcon from './../../../node_modules/material-ui/svg-icons/navigation/more-vert';

const iconStyle = {
    color: "#B2B2B2",
    width: 40,
    height: 40,
};

function NavMenu(props) {
    return (
        <div className="edit-menu">
            <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                width={150}
                iconStyle={iconStyle}
            >
                <MenuItem primaryText="Edit" onClick={props.edit} />
                <MenuItem primaryText="Delete" onClick={props.delete} />
            </IconMenu>
        </div>
    );
}

export default NavMenu;