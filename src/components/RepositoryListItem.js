import {
  Button,
  Chip,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  StarOutline,
  CallSplit,
  AddCircle,
  ArrowDropDown,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import header from "../header";
import clsx from "clsx";
import { genericBtn } from "../styles/globalStyles";

import Chart from "./Chart";
export const returnTimeUpdated = (date) => {
  let dateUpdated = new Date(date);
  let dateNow = new Date();

  if (dateNow - dateUpdated < 60 * 60 * 24 * 1000) {
    return "today";
  }
  if (dateNow - dateUpdated < 60 * 60 * 24 * 2 * 1000) {
    return "yesterday";
  }
  if (dateNow - dateUpdated < 60 * 60 * 24 * 30 * 1000) {
    return (
      Math.floor((dateNow - dateUpdated) / 24 / 60 / 60 / 1000) + " days ago"
    );
  }
  let shortMonth = dateUpdated.toLocaleString("en-us", { month: "short" });

  return (
    "On " +
    shortMonth +
    " " +
    dateUpdated.getDate() +
    ", " +
    dateUpdated.getFullYear()
  );
};

const formatNumber = (number) => {
  let arr = (number + "").split("").reverse();
  let newNumber = "";
  arr.forEach((n, i) => {
    if (i % 3 == 0 && i != 0) {
      newNumber = "," + newNumber;
    }
    newNumber = n + newNumber;
  });
  return newNumber;
};

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: "20px 10px",
    padding: "5px",
    backgroundColor: "#f6f8fa",
  },
  link: {
    textDecoration: "none",
    color: "#0969da",
    fontWeight: "bold",
    fontSize: "1.2rem",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  message: {
    fontSize: "2rem",
    fontStyle: "italic",
    fontWeight: "bold",
    color: "gray",
  },
  visibilityChip: {
    marginLeft: "5px",
  },
  topicChip: {
    margin: "2px",
    backgroundColor: "#ddf4ff",
    color: "#0969da",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#0969da",
      color: "white",
    },
  },
  bottomInfo: {
    marginRight: "5px",
  },
  hoverableInfo: {
    "&:hover": {
      color: "#0969da",
      cursor: "pointer",
    },
  },
  bottomIcon: {
    verticalAlign: "sub",
  },

  starBtn: (props) =>
    props.isMobile
      ? genericBtn
      : {
          ...genericBtn,
          color: "#57606a",
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px",
        },
  downArrowBtn: (props) =>
    props.isMobile
      ? genericBtn
      : {
          ...genericBtn,
          color: "#57606a",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderLeftWidth: "0px",
        },
});

const Circle = ({ style, color }) => {
  //nisam uspeo da nadjem Circle ikonicu u Material-UI-ju
  return (
    <AddCircle
      style={{
        ...style,
        backgroundColor: color,
        color: color,
        borderRadius: "50%",
        width: "1rem",
        height: "1rem",
      }}
    />
  );
};

const returnDataRandomForChart = () => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  return {
    labels: labels.map((x) => ""),
    datasets: [
      {
        data: labels.map(() => Math.round(Math.random() * 11)),
        borderColor: "rgba(0, 255, 0, 0.5)",
        backgroundColor: "rgba(0, 255, 0, 0.5)",
      },
    ],
  };
};

const RepositoryListItem = ({ repo, languageColor }) => {
  const [forksCount, setForksCount] = useState(0);
  useEffect(() => {
    fetch(repo.url, { headers: { ...header.get() } })
      .then((response) => response.json())
      .then((r) => setForksCount(r?.source?.forks ?? 0));
  }, [repo]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles({
    isMobile,
  });

  return (
    <Paper elevation={4} className={classes.root}>
      <Grid container>
        <Grid container item md={9} sm={9} xs={9}>
          <Grid item md={12} sm={12} xs={12}>
            <Link to="/" className={classes.link}>
              {repo?.name}
            </Link>
            <Chip
              className={classes.visibilityChip}
              label={
                repo?.visibility[0].toUpperCase() +
                repo?.visibility.substring(1).toLowerCase()
              }
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <p>{repo?.description}</p>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            {repo?.topics.map((x, i) => (
              <Chip
                label={x}
                size="medium"
                key={i}
                className={classes.topicChip}
              />
            ))}
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <span className={classes.bottomInfo}>
              <Circle
                color={languageColor ?? "transparent"}
                style={{ marginRight: "5px" }}
              />
              {repo?.language}
            </span>

            {repo?.stargazers_count > 0 && (
              <span className={clsx(classes.bottomInfo, classes.hoverableInfo)}>
                <StarOutline className={classes.bottomIcon} />
                {formatNumber(repo?.stargazers_count)}
              </span>
            )}

            {forksCount > 0 && (
              <span className={clsx(classes.bottomInfo, classes.hoverableInfo)}>
                <CallSplit className={classes.bottomIcon} />
                {formatNumber(forksCount)}
              </span>
            )}

            <span className={classes.bottomInfo}>
              Updated {returnTimeUpdated(repo?.updated_at)}
            </span>
          </Grid>
        </Grid>
        <Grid
          container
          item
          md={3}
          sm={3}
          xs={3}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item container justifyContent="flex-end">
            <Grid item container md={12} sm={12} xs={12}>
              <Grid item md={6} sm={6} xs={12}>
                <Button className={classes.starBtn}>
                  <StarOutline /> Star
                </Button>
              </Grid>

              <Grid item md={3} sm={6} xs={12}>
                <Button className={classes.downArrowBtn}>
                  <ArrowDropDown />
                </Button>
              </Grid>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Chart data={returnDataRandomForChart()} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RepositoryListItem;
