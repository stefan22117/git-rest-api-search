import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    borderBottom: "2px solid #24292e",
    marginBottom: "5px",
    boxShadow: "0px 2px 5px #24292e",
    cursor: "pointer",
    borderRadius: "2px",
    backgroundColor: "#f6f8fa",

    height: "60px",
  },
  avatarImg: {
    borderRadius: "50%",
    width: "50px",
  },
});

const SearchedNameHelper = ({ username, searchWord }) => {
  if (!username) {
    return <span></span>;
  }
  let usernameToLower = username.toLowerCase();
  let searchWordToLower = searchWord.toLowerCase();

  if (!usernameToLower.includes(searchWordToLower)) {
    return <span>{username}</span>;
  } else {
    let index = usernameToLower.indexOf(searchWordToLower);
    let nova = username.slice(index, index + searchWord.length);

    return (
      <span>
        {username.slice(0, index)}
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {nova}
        </span>
        {username.slice(index + searchWord.length, username.length - 1)}
      </span>
    );
  }
};

const UserListItem = ({ user, searchWord }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  return (
    <Grid
      container
      item
      md={8}
      sm={8}
      xs={8}
      className={classes.root}
      onClick={() => navigate(`/users/${user.login}`)}
    >
      <Grid
        container
        item
        md={1}
        sm={1}
        xs={1}
        justifyContent="center"
        alignItems="center"
      >
        <img alt="avatar" src={user.avatar_url} className={classes.avatarImg} />
      </Grid>
      <Grid
        container
        item
        md={11}
        sm={11}
        xs={11}
        justifyContent="center"
        alignItems="center"
      >
        <SearchedNameHelper username={user.login} searchWord={searchWord} />
      </Grid>
    </Grid>
  );
};

export default UserListItem;
