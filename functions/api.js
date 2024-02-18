const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

router.get("/org", (req, res) => {
  res.json({
    org: "AC Labs",
    api: {
      type: "public",
    },
  });
});

app.use("/v1", router);

module.exports.handler = serverless(app);
