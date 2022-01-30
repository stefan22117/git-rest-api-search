import {
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import header from "../header";
import User from "./User";
import { ArrowForward } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import * as AuthReduxActions from "../redux/actions/auth";
import { bindActionCreators } from "redux";
const useStyles = makeStyles({
  root: {
    padding: "5px",
    paddingTop: "50px",
  },
  searchInput: {
    width: "75%",
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
  message: {
    fontSize: "1.4rem",
    fontStyle: "italic",
    color: "#24292f",
    textAlign: "center",
  },
  loader: {
    color: "#24292e",
    marginTop: "20px",
  },
  link: {
    textDecoration: "none",
    color: "#24292e",
    fontWeight: "bold",
    "&:hover": {
      textDecoration: "underline",
      color: "#0969da",
    },
  },
  paragraph: {
    color: "#24292e",
    fontSize: "1.5rem",
    margin: "50px",
  },
});

const Home = () => {
  const auth = useSelector((state) => state.auth);
  const authActions = bindActionCreators(AuthReduxActions, useDispatch());

  const [currentUser, setCurrentUser] = useState();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (header.getToken()) {
      authActions.setToken(header.getToken());
    }
  }, []);

  useEffect(() => {
    let url = "https://api.github.com/user";
    fetch(url, { headers: { ...header.get() } })
      .then((response) => response.json())
      .then((data) => setCurrentUser(data))
      .then(() => setLoading(false));
  }, [auth.token]);

  if (currentUser?.login) {
    return <User username={currentUser.login} />;
  }

  return (
    <Grid container justifyContent="center" alignContent="flex-start">
      {loading ? (
        <CircularProgress className={classes.loader} />
      ) : (
        <Grid container justifyContent="center">
          <FormTokenHelper setCurrentUser={setCurrentUser} />
        </Grid>
      )}
    </Grid>
  );
};

const FormTokenHelper = ({ setCurrentUser }) => {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const authActions = bindActionCreators(AuthReduxActions, useDispatch());

  const submitToken = (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Please, write down your token");
      return;
    }
    setLoading(true);
    let url = "https://api.github.com/user";
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.login) {
          setMessage("Token is not valid");
        } else {
          setCurrentUser(data);
          header.setToken(token);
          authActions.setToken(token);
        }
      })
      .then(() => setLoading(false));
  };

  const classes = useStyles();

  return loading ? (
    <CircularProgress className={classes.loader} />
  ) : (
    <form onSubmit={submitToken}>
      <Grid container className={classes.root}>
        <Grid item md={12} sm={12} xs={12}>
          <p className={classes.paragraph}>
            Create{" "}
            <a
              href="https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api#authentication"
              className={classes.link}
              target="_blank"
              rel="noreferrer"
            >
              Access Token
            </a>{" "}
            and discover more functionalities...
          </p>

          <p className={classes.paragraph}>
            You can also{" "}
            <a href="/search" className={classes.link}>
              search
            </a>{" "}
            for users and repos without it (60 requests per hour).
          </p>
        </Grid>

        <Grid item container md={12} sm={12} xs={12} justifyContent="center">
          <TextField
            variant="outlined"
            placeholder="Paste Access Token..."
            className={classes.searchInput}
            name="search"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={submitToken}>
                    <ArrowForward
                      style={{
                        color: "#f6f8fa",
                      }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {message && (
          <Grid item container md={12} sm={12} xs={12} justifyContent="center">
            <p className={classes.message}>{message}</p>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default Home;
