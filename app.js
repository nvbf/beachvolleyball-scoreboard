const util = require("util");
const superagent = require("superagent");

const { parse } = require("url");
const next = require("next");
const express = require("express");
const bodyParser = require("body-parser");
const send = require("./src/util/sendMail");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const pathMatch = require("path-match");

const route = pathMatch();
const match = route("/tournament/:id");

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.json());

    server.post("/send/mail", (req, res) => {
      const result = req.body.result;
      const mail = req.body.mail;
      if (!(mail && result)) {
        return res.status(500).send("feil data");
      }

      const mailStatusCode = send(mail, result);
      if (mailStatusCode == 500) {
        res.status(500).send(":\\ ");
      } else {
        res.send(":)");
      }
    });

    server.get("/tournament/:slug", (req, res) => {
      console.log('TEST')
      const parsedUrl = parse(req.url, true);
      const queryParams = { slug: req.params.slug };
      app.render(req, res, "/tournament", queryParams);
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(process.env.PORT || 3000, err => {
      if (err) {
        throw err;
      }
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
