const express = require("express");
const router = express.Router();
const historyController = require("./control/history.js");
const openaiController = require("./control/openai.js");

let routes = (app) => {
  router.post("/transcript", openaiController.requestTranscript);
  router.post("/request_content", openaiController.requestContent);
  router.post("/texttospeech", openaiController.requestTextToSpeech);
  router.get("/history", historyController.getHistoryAll);
  //router.get("/history/:id", historyController.getHistory);
  
  app.use(router);
};

module.exports = routes;