const express = require("express");
const serverless = require("serverless-http");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");

const app = express();
const router = express.Router();

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    ratelimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:
      "https://dev-20808697.okta.com/oauth2/ausf7wwd42ktta13V5d7/v1/keys",
  }),
  audience: "api://aclabs01.netlify.app",
  issuer: "https://dev-20808697.okta.com/oauth2/ausf7wwd42ktta13V5d7",
  algorithms: ["RS256"],
});

router.get("/", (req, res) => {
  res.json({
    server: {
      status: "running",
    },
  });
});

router.get("/org", (req, res) => {
  res.json({
    org: "AC Labs",
    api: {
      type: "public",
    },
  });
});

router.get("/org/private", jwtCheck, (req, res) => {
  console.log(JSON.stringify(req.auth));
  res.json({
    org: "AC Labs",
    version: "1.0",
    author: "KR",
    api: {
      type: "private",
    },
  });
});

router.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      status: "Invalid Token",
    });
  } else {
    next(err);
  }
});

app.use("/", router);

module.exports.handler = serverless(app);
