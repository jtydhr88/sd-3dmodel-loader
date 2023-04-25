import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function TopToolbar() {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div">
                        My Application
                    </Typography>
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => setAnchorEl(null)}>Menu Item 1</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>Menu Item 2</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>Menu Item 3</MenuItem>
            </Menu>
        </div>
    );
}

export default TopToolbar;
