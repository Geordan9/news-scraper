module.exports = (app, db) => {
  app.get("/", (req, res) => {
    res.render("frontpage", null);
  });
  app.get("/login", (req, res) => {
    res.render("loginpage", null);
  });
};