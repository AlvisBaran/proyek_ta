"use client"

import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';

import SourceIcon from '@mui/icons-material/Source';
import MenuIcon from '@mui/icons-material/Menu';
import InsightsIcon from '@mui/icons-material/Insights';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Icon, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';

const drawerWidth = 240;

function HeaderCreator(props) {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const itemListDrawer = [
    {
      href: "/creator",
      title: "Insights",
      icon: <InsightsIcon />
    },
    {
      href: "/creator/master-content",
      title: "Master Konten",
      icon: <SourceIcon />
    },
    {
      href: "/creator/membership",
      title: "Master Membership",
      icon: <PeopleIcon />
    },
    {
      href: "/creator/request-content",
      title: "Request Konten",
      icon: <RestorePageIcon />
    },
    {
      href: "/creator/history-transaction",
      title: "Histori Transaksi",
      icon: <AccountBalanceWalletIcon />
    },
    {
      href: "/creator/withdraw",
      title: "Withdraw",
      icon: <AccountBalanceIcon />
    },
    {
      href: "/creator/notification",
      title: "Notifikasi",
      icon: <NotificationsIcon />
    }

  ]

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {itemListDrawer.map(item => (
          <Link sx={{width: '100%'}} href={item.href}>
          <ListItem key={item.title} disablePadding>
              <ListItemButton sx={{width: '100%'}}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
          </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [toggleMenuNotif, setToggleMenuNotif] = React.useState(null);
  
  const handleMenuNotif = (event) => {
    setToggleMenuNotif(event.currentTarget);
  };

  const handleCloseMenuNotif = () => {
    setToggleMenuNotif(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
            Responsive drawer
          </Typography>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-notif"
                  aria-haspopup="true"
                  color="inherit"
                  sx={{
                    justifySelf: "end"
                  }}
                  {...bindTrigger(popupState)}
                >
                  <NotificationsIcon />
                </IconButton>
                <Menu
                  id="menu-notif"
                  // anchorEl={toggleMenuNotif}
                  // anchorOrigin={{
                  //   vertical: 'bottom',
                  //   horizontal: 'left',
                  // }}
                  // keepMounted
                  // transformOrigin={{
                  //   vertical: 'bottom',
                  //   horizontal: 'left',
                  // }}
                  // open={Boolean(toggleMenuNotif)}
                  // onClose={handleCloseMenuNotif}
                  // PaperProps={{
                  //   style: {
                  //     ,
                  //     ,
                  //   },
                  // }}
                  {...bindMenu(popupState)}
                >
                  <Paper sx={{ width: '50ch', maxHeight: 45 * 4.5 }} elevation={0}>
                    <MenuList>
                      <MenuItem key={1} onClick={handleClose}> 
                      <Box></Box>
                      <MenuIcon sx={{marginRight: 2}} />
                      <Typography variant="inherit" noWrap>
                      Item 1 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati perferendis libero architecto voluptates et veritatis repellendus reiciendis labore officia quo culpa hic, porro asperiores quae doloremque alias minus minima autem quidem magni, quasi numquam quisquam! Neque rem ex aperiam, commodi accusamus explicabo blanditiis atque expedita deleniti, ipsa, in quos consectetur.s
                      </Typography>
                      </MenuItem>
                      <MenuItem key={2} onClick={handleClose}>Item 2</MenuItem>
                      <MenuItem key={3} onClick={handleClose}>Item 3</MenuItem>
                      <MenuItem key={4} onClick={handleClose}>Item 3</MenuItem>
                      <MenuItem key={5} onClick={handleClose}>Item 3</MenuItem>
                      <MenuItem key={6} onClick={handleClose}>Item 3</MenuItem>
                      <MenuItem key={7} onClick={handleClose}>Item 3</MenuItem>
                      <MenuItem key={8} onClick={handleClose}>Item 3</MenuItem>
                      <MenuItem key={9} onClick={handleClose}>Item 3</MenuItem>
                    </MenuList>
                  </Paper>
                </Menu>
              </>
            )}
          </PopupState>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{
                    justifySelf: "end"
                  }}
                  {...bindTrigger(popupState)}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  {...bindMenu(popupState)}
                >
                  <MenuItem key={1} onClick={handleClose}>Profile</MenuItem>
                  <MenuItem key={2  } onClick={handleClose}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </PopupState>
          
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ p: 3, width: { sm: `calc(100% - ${drawerWidth}px)`, xs: '100%' } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

HeaderCreator.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default HeaderCreator;
