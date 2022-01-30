import React from "react";
import { Grid, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import header from "../header";
import { useNavigate } from "react-router-dom";
import { ExitToApp } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import * as AuthReduxActions from "../redux/actions/auth";
import { bindActionCreators } from "redux";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#24292e",
    height: "40px",
  },
  gridLink: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "white",
    "&.active": {
      fontWeight: "bold",
    },
  },
  logoutTooltip: {
    "& .": {
      backgroundColor: "white",
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: "0px 0px 2px",
      fontSize: "11px",
    },
  },
});

const Navbar = () => {
  const auth = useSelector((state) => state.auth);
  const authActions = bindActionCreators(AuthReduxActions, useDispatch());
  const navigate = useNavigate();

  const logoutClick = () => {
    header.setToken("");
    authActions.unsetToken();
    navigate("/");
  };

  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item md={3} sm={4} xs={4} className={classes.gridLink}>
        <NavLink to="/" className={clsx(classes.link)}>
          Home
        </NavLink>
      </Grid>
      <Grid item md={3} sm={4} xs={4} className={classes.gridLink}>
        <NavLink to="/search" className={clsx(classes.link)}>
          Search
        </NavLink>
      </Grid>
      {auth.token && (
        <Grid
          container
          item
          md={6}
          sm={4}
          xs={4}
          style={{
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            onClick={logoutClick}
            style={{
              color: "white",
            }}
          >
            <ExitToApp />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};

export default Navbar;
