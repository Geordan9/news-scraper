const request = require("request");
const rpn = require("request-promise-native");
const cheerio = require("cheerio");

module.exports = (app, db) => {
    app.get("/scrape", (req, res) => {
        scrapeFoxNews(req, res);
    });

    function scrapeFoxNews(req, res) {
        request("http://www.foxnews.com/", (error, response, html) => {
            const $ = cheerio.load(html);

            $("article.article").each((i, element) => {
                const headingInfo = $(element).children("div.info").children("header.info-header").children("h2.title").children("a");
                const headline = headingInfo.text();
                const url = headingInfo.attr("href");
                let result = {
                    headline,
                    url
                };
                db.Article.find({
                        headline: result.headline
                    })
                    .then(dbArticle => {
                        if (!dbArticle.length) {
                            db.Article.create(result)
                                .catch(err => res.json(err));
                        }
                    })
            });
            res.send("Complete.");
        });
    }

    app.get("/articles", (req, res) => {
        db.Article.find({})
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.get("/articles/:id", (req, res) => {
        db.Article.findOne({
                _id: req.params.id
            })
            .populate("comment")
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.post("/articles/:id", (req, res) => {
        db.Comment.create(req.body)
            .then(dbComment => db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                comment: dbComment._id
            }, {
                new: true
            }))
            .then(dbArticle => {
                res.json(dbArticle);
            })
            .catch(err => {
                res.json(err);
            });
    });
};