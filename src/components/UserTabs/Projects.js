import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import { AllInbox, Ballot } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import header from "../../header";
import ProjectListItem from "../ProjectListItem";

const useStyles = makeStyles({
  selectRoot: {
    width: "50%",
    "& label": {
      marginTop: "-13px",
      marginLeft: "14px",
      "&.Mui-focused": {
        color: "#24292f",
      },
      color: "#24292f",
    },
    "& .MuiSelect-root": {
      padding: "0.5rem",
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#24292f",
    },
  },

  menuItem: {
    "&:hover": {
      backgroundColor: "#f6f8fa",
      color: "#0969da",
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "#f6f8fa",
      color: "#0969da",
    },
    overflowY: "hidden",
    backgroundColor: "#24292f",
    color: "#57606a",
  },

  message: {
    fontSize: "1.4rem",
    fontStyle: "italic",
    color: "#24292f",
    textAlign: "center",
  },
});

export const returnProjects = async (user) => {
  //ide sporije zbog paginacije
  let page = 1;
  let projects = [];
  let newProjects = [];
  let url = "https://api.github.com/users/" + user.login + "/projects";
  while (
    (newProjects = await (
      await fetch(url + "?page=" + page++, { headers: { ...header.get() } })
    ).json()).length
  ) {
    projects = [...projects, ...newProjects];
  }
  return projects;
};

const Projects = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [projectsToShow, setProjectsToShow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [projectState, setProjectState] = useState("open");
  useEffect(() => {
    returnProjects(user)
      .then((projs) =>
        setProjects(
          projs
            .filter((x) => x.state == "open")
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        )
      )
      .then(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    setProjectsToShow(projects);
  }, [projects]);

  useEffect(() => {
    let sortedProjects = projects.filter((x) => x.state == projectState);

    switch (sort) {
      case "newest":
        sortedProjects = sortedProjects.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "oldest":
        sortedProjects = sortedProjects.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "recently_updated":
        sortedProjects = sortedProjects.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        break;
      case "latest_recently_updated":
        sortedProjects = sortedProjects.sort(
          (a, b) => new Date(a.updated_at) - new Date(b.updated_at)
        );
        break;
      case "name":
        sortedProjects = sortedProjects.sort((a, b) =>
          a.name < b.name ? -1 : 1
        );
        break;
    }
    setProjectsToShow(sortedProjects);
  }, [sort, projectState]);

  const classes = useStyles();

  return (
    <Grid
      item
      container
      style={{
        position: "absolute",
        maxWidth: "50%",
        marginRight: "5px",
      }}
    >
      {
        <Paper
          elevation={0}
          style={{
            overflow: "hidden",
            border: "1px solid #57606a",
            margin: "10px",
            width: "100%",
          }}
        >
          <Grid
            container
            style={{
              backgroundColor: "#e0e0e0",
              width: "100%",

              padding: "13px 10px 10px 10px",
            }}
          >
            <Grid item md={2} sm={2} xs={2}>
              <span
                onClick={() => setProjectState("open")}
                style={{
                  cursor: "pointer",
                  color: projectState === "open" ? "#24292f" : "#57606a",
                }}
              >
                <AllInbox
                  style={{
                    verticalAlign: "sub",
                  }}
                />{" "}
                {projects?.filter((x) => x.state === "open").length} Open
              </span>
            </Grid>

            <Grid item md={2} sm={2} xs={2}>
              <span
                onClick={() => setProjectState("close")}
                style={{
                  cursor: "pointer",
                  color: projectState === "close" ? "#24292f" : "#57606a",
                }}
              >
                <Ballot
                  style={{
                    verticalAlign: "sub",
                  }}
                />{" "}
                {projects?.filter((x) => x.state === "close").length} Closed
              </span>
            </Grid>

            <Grid item container justifyContent="flex-end" md={8} sm={8} xs={8}>
              <FormControl className={classes.selectRoot}>
                <InputLabel>Sort</InputLabel>
                <Select
                  variant="outlined"
                  value={sort}
                  label="Sort"
                  onChange={(e) => setSort(e.target.value)}
                >
                  <MenuItem value="newest" className={classes.menuItem}>
                    Newest
                  </MenuItem>
                  <MenuItem value="oldest" className={classes.menuItem}>
                    Oldest
                  </MenuItem>
                  <MenuItem
                    value="recently_updated"
                    className={classes.menuItem}
                  >
                    Recently Updated
                  </MenuItem>
                  <MenuItem
                    value="latest_recently_updated"
                    className={classes.menuItem}
                  >
                    Latest Recently Updated
                  </MenuItem>
                  <MenuItem value="name" className={classes.menuItem}>
                    Name
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {projectsToShow.length ? (
            projectsToShow.map((project, i) => (
              <ProjectListItem project={project} key={i} />
            ))
          ) : (
            <Grid
              container
              style={{
                borderTop: "1px solid #57606a",
              }}
              justifyContent="center"
            >
              {loading ? (
                <CircularProgress
                  style={{
                    margin: "1rem",
                  }}
                />
              ) : (
                <p className={classes.message}>
                  {user.login} doesn't have{" "}
                  {projectState === "open" ? "opened" : "closed"} any projects
                  yet.
                </p>
              )}
            </Grid>
          )}
        </Paper>
      }
    </Grid>
  );
};

export default Projects;
