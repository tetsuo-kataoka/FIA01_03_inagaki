import React, { useState, useContext } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Hidden,
  Link,
} from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "./AuthContext";
import styled from "styled-components";

const drawerWidth = 240;

//App bar 分下げるためのオブジェクト
const SpaceBelowAppBar = styled.div`
  display: flex;
  -webkit-justify-content: center;
  justify-content: center;
  display: table-cell;
  vertical-align: middle;
  height: 64px;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  hide: {
    display: "none",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: "50px",
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("sm")]: {},
  },
  drawerHeader: {
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const Menu = ({ children }) => {
  const { googleLogOut, userName } = useContext(AuthContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleToggleDrawer = () => {
    setOpen((o) => !o);
  };

  const drawer = (
    <div className={classes.drawerHeader}>
      <SpaceBelowAppBar>{userName}</SpaceBelowAppBar>
      <Divider />
      <List>
        <ListItem button component={Link} href="/">
          <ListItemText primary={"Weekly"} />
        </ListItem>
        <ListItem button component={Link} href="/complete">
          <ListItemText primary={"Complete"} />
        </ListItem>
        <ListItem button component={Link} href="/settings">
          <ListItemText primary={"Settings"} />
        </ListItem>
        <ListItem button component={Link} href="/about">
          <ListItemText primary={"About"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemText primary={"LogOut"} onClick={googleLogOut} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleToggleDrawer}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Weekly Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp implementation="css">
          <Drawer
            className={classes.drawer}
            variant="temporary"
            anchor={"left"}
            open={open}
            onClose={handleToggleDrawer}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <SpaceBelowAppBar />
        {children}
      </main>
      <footer class="footer">
        <p>copyright aaaaa.com</p>
      </footer>
    </div>
  );
};

export default Menu;
