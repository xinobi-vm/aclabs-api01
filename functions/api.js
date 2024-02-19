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

// Check Scopes
function checkUserScope(req, res, next) {
  let scp = req.auth.scp;
  if (!(scp.includes("aclabs:read") || scp.includes("aclabs:read-write"))) {
    return res.status(403).json({
      error: "403 Forbidden",
      errorSummary: "Requires atleast aclabs:read in the request",
    });
  }
  next();
}

function checkAdminScope(req, res, next) {
  let scp = req.auth.scp;
  if (!scp.includes("aclabs:read-write")) {
    return res.status(403).json({
      error: "403 Forbidden",
      errorSummary: "Requires aclabs:read-write in the request",
    });
  }
  next();
}

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
  res.json({
    org: "AC Labs",
    version: "1.0",
    author: "KR",
    api: {
      type: "private",
    },
  });
});

router.get("/aclabs/user", jwtCheck, checkUserScope, (req, res) => {
  res.json({
    org: "AC Labs",
    api: {
      type: "private",
    },
    user: {
      type: "aclabs-User",
    },
  });
});

router.get("/aclabs/admin", jwtCheck, checkAdminScope, (req, res) => {
  res.json({
    org: "AC Labs",
    api: {
      type: "private",
    },
    user: {
      type: "aclabs-Admin",
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
