import React, { useState, useEffect } from "react";
import { decode } from "js-base64";
import { marked } from "marked";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import header from "../../header";

const tryToDecode = (string) => {
  let decoded = "";

  try {
    decoded = decode(string);
  } catch (e) {
    return "";
  } finally {
    return decoded;
  }
};

const useStyles = makeStyles({
  message: {
    fontSize: "1.4rem",
    fontStyle: "italic",
    color: "#24292f",
    textAlign: "center",
  },
});
const Overview = ({ user }) => {
  const [readMeFile, setReadMeFile] = useState();

  const classes = useStyles();

  useEffect(() => {
    if (user?.login) {
      let mdFileUrl =
        "https://api.github.com/repos/" +
        user.login +
        "/" +
        user.login +
        "/contents/README.md";
      fetch(mdFileUrl, { headers: { ...header.get() } })
        .then((response) => response.json())
        .then((data) => {
          if (data.type === "file") {
            setReadMeFile(data);
          }
        });
    }
  }, [user]);

  return readMeFile?.name ? (
    <Grid
      dangerouslySetInnerHTML={{
        __html: marked(tryToDecode(readMeFile?.content)),
      }}
    ></Grid>
  ) : (
    <Grid item container justifyContent="center" alignContent="flex-start">
      <p className={classes.message}>User Has Not Added an Overview</p>
    </Grid>
  );
};

export default Overview;
