const env = {
  baserUrlAPI:
    process.env.REACT_APP_ENV === "development"
      ? "http://localhost:2022/api/v1"
      : process.env.REACT_APP_ENV === "stagging"
      ? "http://103.181.183.117:3022/api/v1"
      : "http://103.181.183.117:4022/api/v1",
};

module.exports = env;
