import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import UserTabs from "../components/UserTabs";
import * as SearchReduxActions from "../redux/actions/search";
import header from "../header";
import { withStyles } from "@material-ui/styles";
import globalStyles from "../styles/globalStyles";
import {
  Apartment,
  BookRounded,
  CodeSharp,
  Error,
  LinkSharp,
  LocationOn,
  MailOutline,
  MenuBookRounded,
  PeopleAltSharp,
  StarOutline,
  Twitter,
  ViewCompact,
} from "@material-ui/icons";
import { returnProjects } from "../components/UserTabs/Projects";
import { makeStyles } from "@material-ui/styles";
import { Chip, Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { toast } from "react-hot-toast";

const useStyles = makeStyles({
  avatarImg: {
    width: (props) => (props.isMobile ? "150px" : "300px"),
  },
  followsText: {
    cursor: "pointer",
    color: "#57606a",
    "&:hover": {
      color: "#0969da",
    },
  },
  infoDiv: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    color: "#57606a",

    "& a": {
      textDecoration: "none",
      color: "#57606a",
      "&:hover": {
        textDecoration: "underline",
        color: "#0969da",
      },
    },
  },
  tag: {
    cursor: "pointer",
    alignItems: "center",
    display: "flex",
    padding: "5px",
    paddingRight: "10px",
    "& svg": {
      verticalAlign: "sub",
      margin: "0 5px",
    },
  },
});

const numberFormat = (d) => {
  let k = false;
  for (var e = 0; d >= 1000; e++) {
    k = true;
    d /= 1000;
  }
  if (k) {
    return d.toFixed(1) + " k";
  } else {
    return d;
  }
};

export const returnStarsNumber = async (user) => {
  //ide sporije zbog paginacije
  let page = 1;
  let stars = [];
  let newStars = [];
  let url = "https://api.github.com/users/" + user.login + "/starred";
  while (
    (newStars = await (
      await fetch(url + "?page=" + page++, { headers: { ...header.get() } })
    ).json()).length
  ) {
    stars = [...stars, ...newStars];
  }
  return stars.length;
};
const User = ({ username }) => {
  const params = useParams();
  const [user, setUser] = useState();
  const [starsCount, setStarsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const searchActions = bindActionCreators(SearchReduxActions, useDispatch());
  const [currentUser, setCurrentUser] = useState();

  let realUsername = username ?? params.username;

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles({
    isMobile,
  });

  useEffect(() => {
    let url = "https://api.github.com/user";
    fetch(url, { headers: { ...header.get() } })
      .then((response) => response.json())
      .then((data) => setCurrentUser(data));
  }, []);

  useEffect(() => {
    let url = "https://api.github.com/users/" + realUsername;

    fetch(url, { headers: { ...header.get() } })
      .then((response) => response.json())
      .then((data) => {
        if (!data.login) {
          if (data.message === "Not Found") {
            navigate("/not-found");
          } else {
            toast("403 - No Requests Left", {
              icon: <Error />,
            });
            navigate("/");
          }
        }
        setUser(data);
        returnStarsNumber(data).then((stars) => setStarsCount(stars));
        return data;
      })
      .then((data) =>
        returnProjects(data).then((projects) =>
          setProjectsCount(projects.length)
        )
      );
  }, [realUsername]);

  useEffect(() => {
    if (user?.login) {
      searchActions.addUserToSearchList(user);
    }
  }, [user, searchActions]);

  const tabsRef = useRef();
  useEffect(() => {
    document.addEventListener("scroll", (e) => {
      if (!tabsRef.current.style) {
        return;
      }
      if (window.scrollY > 40) {
        tabsRef.current.style.position = "fixed";
        tabsRef.current.style.top = "0px";
        tabsRef.current.style.marginTop = "0px";
        tabsRef.current.style.zIndex = "10";
      } else {
        tabsRef.current.style.position = "relative";
        tabsRef.current.style.marginTop = "10px";
        tabsRef.current.style.zIndex = "0";
      }
    });
    return () => document.removeEventListener("scroll", () => {});
  }, []);

  const [ActiveTab, setActiveTab] = useState();
  const [stringActiveTab, setStringActiveTab] = useState("Overview");

  useEffect(() => {
    switch (stringActiveTab) {
      case "Overview":
        setActiveTab(<UserTabs.Overview user={user} />);
        break;
      case "Repositories":
        setActiveTab(<UserTabs.Repositories user={user} />);
        break;
      case "Projects":
        setActiveTab(<UserTabs.Projects user={user} />);
        break;
      case "Gists":
        setActiveTab(<UserTabs.Gists user={currentUser} />);
        break;
      case "Stars":
        setActiveTab(<UserTabs.Stars user={user} starsCount={starsCount} />);
        break;
      default:
        setActiveTab(<></>);
    }
  }, [stringActiveTab, user]);

  return (
    <Grid container>
      <Grid
        container
        item
        md={4}
        sm={4}
        xs={12}
        direction="column"
        style={{
          padding: "10px",
          alignItems: "center",
        }}
      >
        <img
          src={user?.avatar_url ?? "/gray.png"}
          alt="avatar"
          className={classes.avatarImg}
          style={{
            borderRadius: "50%",
          }}
        />
        <span
          style={{
            marginBottm: "0px",
            fontSize: "1.5rem",
            color: "#24292f",
          }}
        >
          {user?.name}
        </span>

        <span
          style={{
            marginBottm: "0px",
            fontSize: "1.2rem",
            color: "#57606a",
          }}
        >
          {user?.login}
        </span>

        {user?.bio && (
          <p
            style={{
              color: "#57606a",
            }}
          >
            {user.bio}
          </p>
        )}

        <div
          style={{
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          {user?.followers > 0 && (
            <span className={classes.followsText}>
              <span
                style={{
                  textAlign: "baseline",
                }}
              >
                <span
                  style={{
                    verticalAlign: "sub",
                  }}
                >
                  <PeopleAltSharp />
                </span>
              </span>{" "}
              <span
                style={{
                  color: "#24292f",
                }}
              >
                {numberFormat(user?.followers)}
              </span>{" "}
              followers
            </span>
          )}{" "}
          {user?.following > 0 && (
            <span className={classes.followsText}>
              <span
                style={{
                  color: "#24292f",
                }}
              >
                {numberFormat(user?.following)}
              </span>{" "}
              following
            </span>
          )}
        </div>

        {user?.company && (
          <div className={classes.infoDiv}>
            <Apartment />
            <CompaniesHelper string={user.company} />
          </div>
        )}

        {user?.location && (
          <div className={classes.infoDiv}>
            <LocationOn />
            <span> {user.location}</span>{" "}
          </div>
        )}
        {user?.email && (
          <div className={classes.infoDiv}>
            <MailOutline />
            <a href={`mailto:${user.email}`}> {user.email}</a>
          </div>
        )}
        {user?.blog && (
          <div className={classes.infoDiv}>
            <LinkSharp />
            <a href={user.blog}> {user.blog}</a>
          </div>
        )}
        {user?.twitter_username && (
          <div className={classes.infoDiv}>
            <Twitter />
            <a href={`https://twitter.com/${user.twitter_username}`}>
              {" "}
              @{user.twitter_username}
            </a>
          </div>
        )}
      </Grid>
      <Grid container item md={8} sm={8} xs={12}>
        <div>
          <Grid
            container
            item
            md={12}
            sm={12}
            xs={12}
            ref={tabsRef}
            style={{
              backgroundColor: "white",
              marginTop: "10px",
            }}
          >
            <Grid
              item
              onClick={() => setStringActiveTab("Overview")}
              className={classes.tag}
              style={{
                borderBottom:
                  stringActiveTab === "Overview"
                    ? "3px solid orange"
                    : "0px solid gray",
                color: stringActiveTab === "Overview" ? "#24292f" : "#57606a",
              }}
            >
              <MenuBookRounded /> Overview
            </Grid>
            <Grid
              item
              onClick={() => setStringActiveTab("Repositories")}
              className={classes.tag}
              style={{
                borderBottom:
                  stringActiveTab === "Repositories"
                    ? "3px solid orange"
                    : "0px solid gray",
                color:
                  stringActiveTab === "Repositories" ? "#24292f" : "#57606a",
              }}
            >
              <BookRounded /> Repositories{" "}
              {user?.public_repos > 0 && (
                <Chip label={user?.public_repos} size="small" />
              )}
            </Grid>
            <Grid
              item
              onClick={() => setStringActiveTab("Projects")}
              className={classes.tag}
              style={{
                borderBottom:
                  stringActiveTab === "Projects"
                    ? "3px solid orange"
                    : "0px solid gray",
                color: stringActiveTab === "Projects" ? "#24292f" : "#57606a",
              }}
            >
              <ViewCompact /> Projects
              {projectsCount > 0 && <Chip label={projectsCount} size="small" />}
            </Grid>

            {currentUser?.login &&
              user?.login &&
              currentUser?.login === user?.login && (
                <Grid
                  item
                  onClick={() => setStringActiveTab("Gists")}
                  className={classes.tag}
                  style={{
                    borderBottom:
                      stringActiveTab === "Gists"
                        ? "3px solid orange"
                        : "0px solid gray",
                    color: stringActiveTab === "Gists" ? "#24292f" : "#57606a",
                  }}
                >
                  <CodeSharp /> Gists
                </Grid>
              )}

            <Grid
              item
              onClick={() => setStringActiveTab("Stars")}
              className={classes.tag}
              style={{
                borderBottom:
                  stringActiveTab === "Stars"
                    ? "3px solid orange"
                    : "0px solid gray",
                color: stringActiveTab === "Stars" ? "#24292f" : "#57606a",
              }}
            >
              <StarOutline /> Stars{" "}
              {starsCount > 0 && <Chip label={starsCount} size="small" />}
            </Grid>
          </Grid>
          {ActiveTab}
        </div>
      </Grid>
    </Grid>
  );
};

const CompaniesHelper = ({ string }) => {
  let splittedString = string.split("@");

  splittedString = splittedString
    .map((x) => {
      let company = "";
      let indexOfSpace = x.indexOf(" ");
      if (indexOfSpace > 2) {
        company = x.slice(0, indexOfSpace);
      } else if (x.length) {
        company = x;
      }
      return company;
    })
    .filter((x) => x != "");
  splittedString.forEach((str) => {
    string = string.replace(
      "@" + str,
      `<a href="https://github.com/${str}" style="font-weight:bold;">@${str}</a>`
    );
  });
  return <span dangerouslySetInnerHTML={{ __html: string }}></span>;
};

export default withStyles(globalStyles)(User);
