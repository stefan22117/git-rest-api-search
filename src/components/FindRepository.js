import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import header from "../header";

const returnAllLanguages = async (user) => {
  //ne postoji url koji bi vratio sve jezike koje je korisnik koristio,
  //kao sto postoji za repozitorije :
  // https://api.github.com/repos/{user}/{repo}/languages
  //pa se prolazi kroz svaki repozitori odredjenog korisnika i dodaju se
  //svi jezici po jednom
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
  let languages = {};

  for (let repo of repos) {
    let newLanguages = await (
      await fetch(repo.languages_url, { headers: { ...header.get() } })
    ).json();
    if (Object.keys(newLanguages).length) {
      for (let lang in newLanguages) {
        if (typeof languages[lang] === "undefined") {
          languages[lang] = newLanguages[lang];
        }
      }
    }
  }
  return Object.keys(languages);
};

const useStyles = makeStyles({
  searchInput: {
    width: "100%",
    "& .MuiInputBase-root": {
      transition: "all 0.5s ease-in",
      backgroundColor: "white",
      color: "#24292e",
      "&.Mui-focused fieldset": {
        borderColor: "#24292e",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "0.5rem",
    },
  },

  selectRoot: {
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
    fontSize: "2rem",
    fontStyle: "italic",
    fontWeight: "bold",
    color: "gray",
  },
});

const FindRepository = ({ user, allRepos, setRepos }) => {
  const [languages, setLanguages] = useState([]);

  const [pairs, setPairs] = useState({
    word: "",
    language: "all",
    sort: "last_updated",
    page: 1,
  });
  useEffect(() => {
    Promise.resolve(
      (async () => {
        if (user?.public_repos < 10) {
          // ovo je zbog limita, staviti do 10
          setLanguages(await returnAllLanguages(user));
        } else {
          setLanguages(["SCSS", "JavaScript", "C#", "Python", "Java"]);
        }
      })()
    );
  }, [user]);

  useEffect(() => {
    let newRepos = [...allRepos];

    if (pairs.word !== "") {
      newRepos = newRepos.filter((x) => x.name.includes(pairs.word));
    }

    if (pairs.language !== "all") {
      newRepos = newRepos.filter((x) => x.language === pairs.language);
    }

    if (pairs.sort !== "") {
      switch (pairs.sort) {
        case "last_updated":
          newRepos = newRepos.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          );
          break;
        case "name":
          newRepos = newRepos.sort((a, b) => (a.name < b.name ? -1 : 1));
          break;
        case "stars":
          newRepos = newRepos.sort(
            (a, b) => b.stargazers_count - a.stargazers_count
          );
          break;
        default:
      }
    }

    setRepos(newRepos);
  }, [pairs, allRepos, setRepos]);
  const classes = useStyles();
  return (
    <Grid
      container
      item
      spacing={2}
      style={{
        margin: "10px 10px 0px 10px",
      }}
    >
      <Grid item md={4} sm={12} xs={12}>
        <TextField
          variant="outlined"
          placeholder="Find a repository..."
          className={classes.searchInput}
          onChange={(e) => setPairs({ ...pairs, word: e.target.value })}
          autoComplete="off"
        />
      </Grid>
      <Grid item md={4} sm={6} xs={12}>
        <FormControl fullWidth className={classes.selectRoot}>
          <InputLabel>Language</InputLabel>
          <Select
            variant="outlined"
            value={pairs.language}
            label="Language"
            onChange={(e) => setPairs({ ...pairs, language: e.target.value })}
          >
            <MenuItem value="all" className={classes.menuItem}>
              All
            </MenuItem>
            {languages.map((x) => (
              <MenuItem key={x} value={x} className={classes.menuItem}>
                {x}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item md={4} sm={6} xs={12}>
        <FormControl fullWidth className={classes.selectRoot}>
          <InputLabel>Sort</InputLabel>
          <Select
            variant="outlined"
            value={pairs.sort}
            label="Sort"
            onChange={(e) => setPairs({ ...pairs, sort: e.target.value })}
          >
            <MenuItem value="last_updated" className={classes.menuItem}>
              Last Updated
            </MenuItem>
            <MenuItem value="name" className={classes.menuItem}>
              Name
            </MenuItem>
            <MenuItem value="stars" className={classes.menuItem}>
              Stars
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default FindRepository;
