const env = {
  baserUrlAPI:
    process.env.REACT_APP_ENV === "development"
      ? "http://localhost:2022/api/v1"
      : process.env.REACT_APP_ENV === "stagging"
      ? "https://stagging-api-adminpanel.alglodieloggy.com/api/v1"
      : "https://api-adminpanel.alglodieloggy.com/api/v1",
};

module.exports = env;
