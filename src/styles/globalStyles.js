const globalStyles = () => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.6em",
    },
    "*::-webkit-scrollbar-track": {
      backgroundColor: "#f6f8fa",
      border: "2px solid #24292e",
      borderRadius: "12px",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "#24292e",
      borderRadius: "12px",
    },
    "*": {
      textTransform: "none",
    },
    ".MuiCircularProgress-svg": {
      color: "#24292e",
    },
    ".MuiMenu-paper": {
      backgroundColor: "#24292e",
    },
  },
});

export const genericBtn = {
  borderRadius: "6px",
  color: "#0969da",
  backgroundColor: "#f6f8fa",
  padding: "5px 16px",
  fontSize: "14px",
  border: "1px solid #57606a",
  borderWidth: "1px",
  width: "100%",
  marginBottom: "10px",
};

export const prevNextBtn = {
  borderRadius: "6px",
  color: "#0969da",
  backgroundColor: "#f6f8fa",
  padding: "5px 16px",
  fontSize: "14px",
  border: "1px solid gray",
  borderWidth: "1px",
  width: "30%",
  marginBottom: "10px",
  "& span": {
    fontWeight: "bold",
  },
};

export const getColorObject = () => {
  return Promise.resolve(
    fetch(
      "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json"
    )
      .then((response) => response.json())
      .then((data) => data)
  );
};

export default globalStyles;
