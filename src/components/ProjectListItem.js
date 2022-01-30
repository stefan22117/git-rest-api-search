import { Grid } from "@material-ui/core";
import { AccessTime } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { returnTimeUpdated } from "./RepositoryListItem";

const useStyles = makeStyles({
  root: {
    borderTop: "1px solid #57606a",
    padding: "10px",
  },
  link: {
    textDecoration: "none",
    color: "#24292e",
    fontWeight: "bold",
    fontSize: "1rem",
    "&:hover": {
      textDecoration: "underline",
      color: "#0969da",
    },
  },
  updatedInfo: {
    color: "#57606a",
    fontSize: "0.8rem",
    "& svg": {
      fontSize: "1.2rem",
      verticalAlign: "sub",
    },
  },
});

const ProjectListItem = ({ project }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item container md={4} sm={4} xs={4} direction="column">
        <Grid item>
          <a
            href={`https://github.com/users/${project?.creator.login}/projects/${project?.number}`}
            className={classes.link}
          >
            {project?.name}
          </a>
        </Grid>

        <Grid item className={classes.updatedInfo}>
          <AccessTime /> Updated {returnTimeUpdated(project.updated_at)}
        </Grid>
      </Grid>

      <Grid item md={8} sm={8} xs={8}>
        <p
          style={{
            margin: "5px",
          }}
        >
          {project.body}
        </p>
      </Grid>
    </Grid>
  );
};

export default ProjectListItem;
