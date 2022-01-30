import { Button, Grid } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  rootImg: {
    width: "100%",
    height: "100%",
  },
  seeMoreBtn: {
    position: "fixed",
    transition: "color 250ms",
    zIndex: "99",
    top: "0px",
    textTransform: "none",
    left: "0px",
    borderRadius: "0px 0px 6px 0px",
    borderTop: "none",
    color: "#0969da",
    backgroundColor: "#f6f8fa",
    padding: "5px 16px",
    fontSize: "14px",
    border: "1px solid gray",
    borderWidth: "1px",
    width: "20%",
    "&:hover": {
      color: "white",
    },
  },
});

const NotFound = () => {
  let zIndex = 1;

  const classes = useStyles();
  useEffect(() => {
    document.addEventListener("mousemove", (e) => {
      setCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
    });

    return document.removeEventListener("mousemove", () => {});
  }, []);

  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  return (
    <Grid container>
      <Button className={classes.seeMoreBtn} onClick={() => navigate(-1)}>
        <ArrowBack
          style={{
            fontSize: "1rem",
          }}
        />{" "}
        Go back
      </Button>

      <Image
        src="/404-1.jfif"
        coordinates={coordinates}
        className={classes.rootImg}
      />
      <Image
        top={180}
        left={800}
        zIndex={zIndex++}
        src="/404-4.png"
        movement={{
          direction: false,
          range: 10,
        }}
        coordinates={coordinates}
      />

      <Image
        top={150}
        left={500}
        zIndex={zIndex++}
        src="/404-3.png"
        movement={{
          direction: false,
          range: 7,
        }}
        coordinates={coordinates}
      />

      <Image
        top={400}
        left={530}
        zIndex={zIndex++}
        src="/404-7.png"
        movement={{
          direction: true,
          range: 5,
        }}
        coordinates={coordinates}
      />

      <Image
        top={430}
        left={450}
        zIndex={zIndex++}
        src="/404-8.png"
        movement={{
          direction: true,
          range: 5,
        }}
        coordinates={coordinates}
      />

      <Image
        top={275}
        left={520}
        zIndex={zIndex++}
        src="/404-2.png"
        movement={{
          direction: true,
          range: 5,
        }}
        coordinates={coordinates}
      />

      <Image
        top={230}
        left={440}
        zIndex={zIndex++}
        src="/404-5.png"
        movement={{
          direction: true,
          range: 10,
        }}
        coordinates={coordinates}
      />

      <Image
        top={210}
        left={150}
        zIndex={zIndex++}
        src="/404-6.png"
        movement={{
          direction: true,
          range: 5,
        }}
        coordinates={coordinates}
      />
    </Grid>
  );
};

const Image = ({
  top,
  left,
  zIndex,
  src,
  style,
  movement,
  coordinates,
  className,
}) => {
  if (movement) {
    if (coordinates.x < left) {
      if (movement.direction) {
        if (coordinates.x < left - movement.range) {
          left = left - movement.range;
        } else {
          left = coordinates.x;
        }
      } else {
        if (coordinates.x < left + movement.range) {
          left = left + movement.range;
        } else {
          left = coordinates.x;
        }
      }
    } else {
      if (movement.direction) {
        if (coordinates.x > left - movement.range) {
          left = left + movement.range;
        } else {
          left = coordinates.x;
        }
      } else {
        if (coordinates.x > left + movement.range) {
          left = left - movement.range;
        } else {
          left = coordinates.x;
        }
      }
    }

    if (coordinates.y < top) {
      if (movement.direction) {
        if (coordinates.y < top - movement.range) {
          top = top - movement.range;
        } else {
          top = coordinates.y;
        }
      } else {
        if (coordinates.y < top + movement.range) {
          top = top + movement.range;
        } else {
          top = coordinates.y;
        }
      }
    } else {
      if (movement.direction) {
        if (coordinates.y > top - movement.range) {
          top = top + movement.range;
        } else {
          top = coordinates.y;
        }
      } else {
        if (coordinates.y > top + movement.range) {
          top = top - movement.range;
        } else {
          top = coordinates.y;
        }
      }
    }
  }
  return (
    <img
      className={clsx(className)}
      style={{
        ...style,
        top: top ?? 0,
        left: left ?? 0,
        zindex: zIndex ?? 1,
        position: "absolute",
        transition: "all 1s ease",
      }}
      src={src}
    />
  );
};

export default NotFound;
