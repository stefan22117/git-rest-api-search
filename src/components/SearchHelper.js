import { Grid, IconButton } from "@material-ui/core";
import { ClearSharp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as SearchReduxActions from "../redux/actions/search";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#24292e",
    borderTop: "2px solid white",
    margin: "5px , 0",
    borderRadius: "5px",

    width: (props) => (props.searchWord ? "100%" : "50%"),
    transition: "all 0.5s ease-in",
  },
  usernameText: {
    color: "white",
  },
  linkGrid: {
    cursor: "pointer",
  },
  avatarImg: {
    borderRadius: "50%",
    width: "40px",
  },
});

const SearchHelper = ({ show, searchWord }) => {
  const searchList = useSelector((state) => state.search);

  useEffect(() => {
    if (xClicked) {
      setShowState(true);
    } else {
      setShowState(show);
    }
  }, [show]);
  const [xClicked, setXClicked] = useState(false);
  const [showState, setShowState] = useState(show);

  const [searchListToShow, setSearchListToShow] = useState(searchList.lastFive);

  useEffect(() => {
    if (searchWord) {
      setSearchListToShow(
        searchList.lastFive.filter((x) =>
          x.login.toLowerCase().includes(searchWord.toLowerCase())
        )
      );
    } else {
      setSearchListToShow(searchList.lastFive);
    }
    return () => {
      setSearchListToShow([]);
    };
  }, [searchWord, searchList]);

  const searchActions = bindActionCreators(SearchReduxActions, useDispatch());
  const removeUser = (user) => {
    setXClicked(true);
    searchActions.removeUserFromSearchList(user);
  };

  const navigate = useNavigate();
  const classes = useStyles({ searchWord });
  return (
    <>
      {searchListToShow.length > 0 &&
        showState &&
        searchListToShow.map((x, i) => (
          <Grid
            container
            item
            md={12}
            sm={12}
            xs={12}
            key={i}
            container
            justifyContent="center"
          >
            <Grid container className={classes.root}>
              <Grid
                item
                container
                md={1}
                sm={1}
                xs={1}
                justifyContent="center"
                alignItems="center"
                className={classes.linkGrid}
                onClick={() => navigate(`/users/${x.login}`)}
              >
                <img
                  alt="avatar"
                  src={x.avatar_url}
                  className={classes.avatarImg}
                />
              </Grid>

              <Grid
                item
                container
                md={10}
                sm={10}
                xs={10}
                justifyContent="flex-start"
                alignItems="center"
                className={classes.linkGrid}
                onClick={() => navigate(`/users/${x.login}`)}
              >
                <span className={classes.usernameText}>{x.login}</span>
              </Grid>

              <Grid
                item
                container
                md={1}
                sm={1}
                xs={1}
                justifyContent="center"
                alignItems="center"
              >
                <IconButton
                  onClick={() => removeUser(x)}
                  style={{
                    color: "white",
                  }}
                >
                  <ClearSharp />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
    </>
  );
};

export default SearchHelper;
