import React, { useState, useContext } from "react";
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
  // 以下を分岐点として設定
  // sm:600px スマホ
  // lg:1200px 以下：タブレット
  // スマホ　320-540px
  // タブレット 600px-1024px
  // PC 1280px-
  root: {
    display: "flex",
  },

  // 上のアプリケーションバー
  // lgより大きい場合はメニューを出す
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },

  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  drawerHeader: {
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },

  drawerPaper: {
    width: drawerWidth,
  },

  content: {
    marginTop: "64px",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "1280px",
    flexGrow: 1,
    padding: theme.spacing(0),
  },

  footer: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  sizeColor: {
    [theme.breakpoints.down("sm")]: {
      color: "Blue",
    },
    [theme.breakpoints.up("sm")]: {
      color: "Pink",
    },
    [theme.breakpoints.up("lg")]: {
      color: "Green",
    },
  },
}));

const AdminMenu = ({ children, isAdmin }) => {
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
        {isAdmin && (
          <>
            <ListItem button component={Link} href="/edit">
              <ListItemText primary={"QuestionEdit"} />
            </ListItem>
            <ListItem button component={Link} href="/">
              <ListItemText primary={"Weekly"} />
            </ListItem>
          </>
        )}
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
        {/* 隠れている時のメニュー lgDownの時に見せる＝lgUpの時に隠す  */}
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
        {/* 出ている時のメニュー lgUpの時は見せる＝lgDown の時に隠す */}
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
      <main className={classes.content}>
        {children}
        <footer class="footer">
          <div className={classes.sizeColor}>copyright aaaaa.com</div>
        </footer>
      </main>
    </div>
  );
};

export default AdminMenu;
