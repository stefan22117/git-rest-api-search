import { Button, CircularProgress, Grid, TextField } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import globalStyles from "../styles/globalStyles";
import SearchHelper from "../components/SearchHelper";
import UserListItem from "../components/UserListItem";
import header from "../header";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Error } from "@material-ui/icons";
const useStyles = makeStyles({
  root: {
    height: "calc( 100vh - 40px )",
    padding: "5px",
    paddingTop: (props) => (props.searchWord ? "5px" : "150px"),
    transition: "padding-top 0.5s ease-in",
  },
  searchInput: {
    width: (props) => (props.searchWord ? "100%" : "50%"),
    transition: "all 0.5s ease-in",
    "& .MuiInputBase-root": {
      transition: "all 0.5s ease-in",
      backgroundColor: (props) => (props.searchWord ? "white" : "#24292e"),
      color: (props) => (props.searchWord ? "#24292e" : "white"),

      "&.Mui-focused fieldset": {
        borderColor: "#24292e",
      },
    },
  },
  usersList: {
    height: "75%",
    overflow: "auto",
  },
  link: {
    textDecoration: "none",
    color: "white",
    "&.active": {
      fontWeight: "bold",
    },
  },
  seeMoreBtn: {
    borderRadius: "6px",
    color: "#0969da",
    backgroundColor: "#f6f8fa",
    padding: "5px 16px",
    fontSize: "14px",
    border: "1px solid gray",
    borderWidth: "1px",
    width: "30%",
    marginBottom: "10px",
    "& span": {
      fontWeight: "bold",
    },
  },
  message: {
    fontSize: "2rem",
    fontStyle: "italic",
    fontWeight: "bold",
    color: "gray",
  },
});
const SearchUsers = () => {
  const [searchWord, setSearchWord] = useState("");
  const [users, setUsers] = useState([]);
  const [usersToShow, setUsersToShow] = useState([]);
  const [showHelper, setShowHelper] = useState(false);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [showMoreClicked, setShowMoreClicked] = useState(1);
  const navigate = useNavigate();
  const searchList = useSelector((state) => state.search);

  const searchChange = (e) => {
    setShowMoreClicked(1);
    setPage(2);
    setShowHelper(true);

    setUsers([]);
    setSearchWord(e.target.value);
  };

  useEffect(() => {
    setUsers([]);
    if (searchWord) {
      setLoading(true);
      let url =
        "https://api.github.com/search/users?per_page=11&q=" + searchWord;
      fetch(url, { headers: { ...header.get() } })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            toast("403 - No Requests Left", {
              icon: <Error />,
            });
            navigate("/");
          }

          if (searchWord) {
            setUsers(data.items);
          }
        })
        .then(() => setLoading(false));
    }

    return () => setUsers([]);
  }, [searchWord]);

  useEffect(() => {
    setUsersToShow(users?.slice(0, 10 * showMoreClicked));
    return () => setUsersToShow([]);
  }, [users, showMoreClicked]);

  const showMoreClick = () => {
    let diff = users?.length - usersToShow?.length;
    setShowMoreClicked(showMoreClicked + 1);

    if (diff > 0) {
      if (searchWord) {
        let url =
          "https://api.github.com/search/users?q=" +
          searchWord +
          "&per_page=20&page=" +
          page;

        fetch(url, { headers: { ...header.get() } })
          .then((response) => response.json())
          .then((data) => setUsers([...users, ...data.items]));
        setPage(page + 1);
      }
    }
  };

  const classes = useStyles({ searchWord });
  return (
    <Grid container className={classes.root}>
      <Grid container justifyContent="center" item md={12} sm={12} xs={12}>
        <TextField
          variant="outlined"
          placeholder="Search Users..."
          className={classes.searchInput}
          name="search"
          onChange={searchChange}
          onFocus={() => setShowHelper(true)}
          onClick={() => setShowHelper(true)}
          onBlur={() =>
            setTimeout(() => {
              setShowHelper(false);
            }, 100)
          }
          autoComplete="off"
        />
      </Grid>
      <Grid container justifyContent="center" item md={12} sm={12} xs={12}>
        <SearchHelper
          searchList={searchList}
          show={showHelper}
          searchWord={searchWord}
        />
      </Grid>
      <Grid
        item
        container
        className={classes.usersList}
        md={12}
        sm={12}
        xs={12}
        justifyContent="center"
        onScroll={() => setShowHelper(false)}
      >
        {usersToShow?.length ? (
          <>
            {usersToShow.map((user, i) => (
              <UserListItem user={user} searchWord={searchWord} key={i} />
            ))}
          </>
        ) : (
          <Grid
            item
            container
            justifyContent="center"
            alignContent="flex-start"
          >
            {loading ? (
              <CircularProgress />
            ) : searchWord ? (
              <p className={classes.message}>No Users Found</p>
            ) : (
              <p className={classes.message}>Search For Users</p>
            )}
          </Grid>
        )}
      </Grid>

      {users?.length - usersToShow?.length > 0 && (
        <Grid container item justifyContent="center" md={12} sm={12} xs={12}>
          <Button onClick={showMoreClick} className={classes.seeMoreBtn}>
            See More
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default withStyles(globalStyles)(SearchUsers);
