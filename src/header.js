class Header {
  constructor() {}
  setToken(token) {
    document.cookie = `token=${token}; `;
  }
  getToken() {
    let cookieValue = document.cookie;
    if (cookieValue) {
      cookieValue = cookieValue
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];
    }
    return cookieValue;
  }
  get() {
    let cookieValue = document.cookie;
    if (cookieValue) {
      cookieValue = cookieValue
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];
    }
    return cookieValue
      ? {
          Authorization: `Bearer ${cookieValue}`,
        }
      : {};
  }
}

export default new Header();
