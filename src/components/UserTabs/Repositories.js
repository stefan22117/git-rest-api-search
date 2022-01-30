import { Button, CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import FindRepository from "../FindRepository";
import RepositoryListItem from "../RepositoryListItem";
import header from "../../header";
import { makeStyles } from "@material-ui/styles";
import { getColorObject, prevNextBtn } from "../../styles/globalStyles";

export const returnAllRepositories = async (user) => {
  let page = 1;
  let repos = [];
  let newRepos = [];
  while (
    (newRepos = await (
      await fetch(user.repos_url + "?page=" + page++, {
        headers: { ...header.get() },
      })
    ).json()).length
  ) {
    repos = [...repos, ...newRepos];
  }
  return repos;
};
const useStyles = makeStyles({
  message: {
    fontSize: "1.4rem",
    fontStyle: "italic",
    color: "#24292f",
    textAlign: "center",
  },

  prevBtn: {
    ...prevNextBtn,
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "0px",
  },
  nextBtn: {
    ...prevNextBtn,
    borderTopLeftRadius: "0px",
    borderBottomLeftRadius: "0px",
    borderLeftWidth: "0px",
  },
});
const Repositories = ({ user }) => {
  const [repos, setRepos] = useState([]);
  const [reposToShow, setReposToShow] = useState([]);
  const [allRepos, setAllRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [colorsObject, setColorsObject] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    getColorObject().then((data) => setColorsObject(data));

    returnAllRepositories(user).then((repos) => {
      setAllRepos(repos);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let newRepos = repos.slice((page - 1) * 3, page * 3);
    setReposToShow(newRepos);
  }, [repos, page]);

  const prevClick = () => {
    if (page === 1) {
      return;
    }
    setPage(page - 1);
    window.scroll({
      top: 0,
    });
  };

  const nextClick = async () => {
    let numberOfPages = Math.ceil(repos.length / 3);
    if (page === numberOfPages) {
      return;
    }
    setPage(page + 1);
    window.scroll({
      top: 0,
    });
  };
  const classes = useStyles();
  return (
    <Grid item container>
      <FindRepository
        user={user}
        allRepos={allRepos}
        setRepos={setRepos}
        setLoading={setLoading}
      />
      {reposToShow?.length > 0 ? (
        <Grid container item>
          {reposToShow.map((x, i) => (
            <RepositoryListItem
              repo={x}
              key={i}
              languageColor={colorsObject[x.language]?.color}
            />
          ))}

          <Grid
            item
            container
            justifyContent="center"
            style={{
              marginBottom: "5px",
            }}
          >
            <Button
              className={classes.prevBtn}
              onClick={prevClick}
              disabled={page === 1 ? true : false}
            >
              Previous
            </Button>
            <Button
              className={classes.nextBtn}
              onClick={nextClick}
              disabled={page === Math.ceil(repos.length / 3) ? true : false}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid container justifyContent="center" alignContent="flex-start">
          {loading ? (
            <CircularProgress />
          ) : (
            <p className={classes.message}>User Has No Repositories</p>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default Repositories;
