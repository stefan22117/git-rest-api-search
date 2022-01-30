import { Button, CircularProgress, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Code } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import header from "../../header";
import { returnTimeUpdated } from "../RepositoryListItem";
import { Link } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    margin: "10px",
    border: "1px solid #57606a",
    cursor: "pointer",
    "& .view-first": {
      display: "none",
    },
    "&:hover": {
      border: "1px solid #0969da",
      "& .view-first": {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "start",
      },
    },
  },
  rootFile: {
    overflow: "hidden",
    margin: "5px 0px 5px 0px",
    border: "1px solid #57606a",
  },
  viewFirstFileName: {
    color: "white",
    backgroundColor: "#0969da",
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  line: {
    display: "block",
    overflow: "auto",
  },
  lineNumber: {
    color: "#57606a",
    paddingRight: "10px",
  },
  codeField: {
    paddingLeft: "25px",
    paddingTop: "3px",
    fontFamily:
      "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  message: {
    fontSize: "1.4rem",
    fontStyle: "italic",
    color: "#24292f",
    textAlign: "center",
  },
  codeIconBox: {
    border: "2px solid #24292f",
    width: "15px",
    height: "15px",
    margin: "2px",
    marginRight: "6px",
    padding: "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& svg": {
      fontSize: "1rem",
      color: "#24292f",
    },
  },
  link: {
    textDecoration: "none",
    color: "#0969da",
    fontWeight: "bold",
    fontSize: "1rem",
    "&:hover": {
      textDecoration: "underline",
      color: "#0969da",
    },
  },
  rawBtn: {
    marginRight: 0,
    justifySelf: "flex-end",
    border: "1px solid #24292f",
    padding: "0px",
  },
  commentAvatar: {
    borderRadius: "50%",
    width: "30px",
  },
  commentLink: {
    textDecoration: "none",
    color: "#24292e",
    "&:hover": {
      textDecoration: "underline",
      color: "#0969da",
    },
  },
  commentAvatar: {
    width: "50%",
    borderRadius: "50%",
  },
});

const Gists = ({ user }) => {
  const [gists, setGists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gistChosen, setGistChosen] = useState(false);

  useEffect(() => {
    if (user?.login) {
      let url = "https://api.github.com/gists";
      fetch(url, { headers: { ...header.get() } })
        .then((response) => response.json())
        .then((data) => setGists(data))
        .then(() => setLoading(false));
    } else {
      setGists([]);
    }
  }, [user]);

  const classes = useStyles();
  return (
    <Grid
      style={{
        position: "absolute",
        width: "50%",
      }}
    >
      {gistChosen ? (
        <>
          <GistFileList gist={gistChosen} />
          <GistCommentList gist={gistChosen} />
        </>
      ) : gists.length ? (
        gists.map((gist, i) => (
          <GistListItem gist={gist} key={i} setGistChosen={setGistChosen} />
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
            <p className={classes.message}>You don't have any gists yet.</p>
          )}
        </Grid>
      )}
    </Grid>
  );
};

const GistListItem = ({ gist, setGistChosen }) => {
  let firstFileName = Object.keys(gist.files)[0];
  const [firstFile, setFirstFile] = useState();
  useEffect(() => {
    if (firstFileName) {
      fetch("https://api.github.com/gists/" + gist.id, {
        headers: { ...header.get() },
      })
        .then((response) => response.json())
        .then((data) => {
          let file = data.files[firstFileName];
          setFirstFile(file);
        });
    }
  }, [gist]);

  const classes = useStyles();

  let rows = firstFile?.content.split("\n");
  return (
    <Paper
      elevation={0}
      className={classes.root}
      onClick={() => setGistChosen(gist)}
    >
      <Grid container>
        <Grid item md={10} sm={10} xs={12}>
          <div className={classes.codeField}>
            {rows?.map((row, i) => (
              <span className={classes.line} key={i}>
                <span className={classes.lineNumber}>{i + 1} </span>
                {row}
              </span>
            ))}
          </div>
        </Grid>
        <Grid item md={2} sm={2} xs={12} className="view-first">
          <span className={classes.viewFirstFileName}>
            {firstFile?.filename}
          </span>
        </Grid>
      </Grid>
    </Paper>
  );
};

const GistFileList = ({ gist }) => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (gist.id) {
      fetch("https://api.github.com/gists/" + gist.id, {
        headers: { ...header.get() },
      })
        .then((response) => response.json())
        .then((data) => {
          let files = Object.keys(data.files).map((x) => data.files[x]);
          setFiles(files);
        });
    }
  }, [gist]);

  return (
    <>
      {files.map((file, i) => (
        <GistFile file={file} key={i} gist={gist} />
      ))}
    </>
  );
};
const GistFile = ({ file, gist }) => {
  const classes = useStyles();
  const clickRaw = () => {
    var rawTab = window.open("", "_blank");
    rawTab.document.write("<code>" + file.content + "</code>");
    rawTab.document.close();
  };
  let rows = file?.content.split("\n");
  return (
    <Paper elevation={0} className={classes.rootFile}>
      <Grid container>
        <Grid
          item
          container
          md={12}
          sm={12}
          xs={12}
          style={{
            backgroundColor: "#e0e0e0",
            padding: "5px",
          }}
        >
          <Grid container item md={6} sm={6} xs={6}>
            <i className={classes.codeIconBox}>
              <Code />
            </i>
            <a
              href={`https://gist.github.com/${gist?.owner?.login}/${
                gist.id
              }#file-${file?.filename.replace(".", "-")}`}
              target="_blank"
              className={classes.link}
            >
              {file.filename}
            </a>
          </Grid>

          <Grid container item md={6} sm={6} xs={6} justifyContent="flex-end">
            <Button onClick={clickRaw} className={classes.rawBtn}>
              Raw
            </Button>
          </Grid>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <div className={classes.codeField}>
            {rows?.map((row, i) => (
              <span className={classes.line} key={i}>
                <span className={classes.lineNumber}>{i + 1} </span>
                {row}
              </span>
            ))}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

const GistComment = ({ comment }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      style={{
        marginBottom: "5px",
      }}
    >
      <Grid
        container
        item
        md={2}
        sm={2}
        xs={2}
        justifyContent="center"
        alignItems="flex-start"
      >
        <img
          alt="avatar"
          src={comment?.user.avatar_url}
          className={classes.commentAvatar}
        />
      </Grid>

      <Grid
        item
        container
        md={10}
        sm={10}
        xs={10}
        style={{
          borderRadius: "5px",
          border: "1px solid #bbdfff",
          position: "relative",
        }}
      >
        <CommentArrow />
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          style={{
            backgroundColor: "#ddf4ff",
            borderBottom: "1px solid #bbdfff",
            paddingLeft: "10px",
            padding: "7px",
          }}
        >
          <Link
            to={`/users/${comment?.user.login}`}
            className={classes.commentLink}
          >
            {comment?.user.login}
          </Link>
          <span
            style={{
              color: "#57606a",
            }}
          >
            {" "}
            commented {returnTimeUpdated(comment.updated_at)}
          </span>
        </Grid>
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          style={{
            padding: "15px",
            wordWrap: "break-word",
          }}
        >
          {comment?.body}
        </Grid>
      </Grid>
    </Grid>
  );
};
const GistCommentList = ({ gist }) => {
  const [commentsList, setCommentsList] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    let url = `https://api.github.com/gists/${gist.id}/comments`;
    fetch(url, { headers: { ...header.get() } })
      .then((response) => response.json())
      .then((data) => setCommentsList(data))
      .then(() => setLoading(false));
  }, []);

  return (
    <Grid
      style={{
        marginTop: "10px",
      }}
    >
      {commentsList.length > 0
        ? commentsList.map((comment, i) => (
            <GistComment comment={comment} key={i} />
          ))
        : loading && <CircularProgress />}
    </Grid>
  );
};

const CommentArrow = () => {
  return (
    <div
      style={{
        position: "absolute",
        borderLeft: "1px solid #bbdfff",
        borderBottom: "1px solid #bbdfff",
        backgroundColor: "#ddf3ff",
        padding: "5px",
        transform: "rotate(45deg)",
        top: "10px",
        left: "-7px",
      }}
    ></div>
  );
};

export default Gists;
