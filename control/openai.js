const OpenAI = require('openai');
const fs = require("fs");
const path = require("path");
const uploadFile = require("../middleware.upload.js");
require('dotenv').config({path: require('find-config')('openai.env')});
const openaiClient = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const historyDir = process.env.HISTORY_DIR_NAME || "history";

const requestContent = async (req, res) => {
    console.log("user.text (" + req.body.id + "): " + req.body.content);
    try {
        const completion = await openaiClient.chat.completions.create({
            messages: [{ role: "system", content: req.body.content }],
            model: process.env.OPENAI_API_CHAT_COMPLETIONS_MODEL || "gpt-3.5-turbo",
        });
        console.log("openai.text (" + req.body.id + "): " + completion.choices[0].message.content);
        res.send(completion.choices[0].message.content);
    } catch (err) {
        res.status(500).send({
            message: "Could not request content from OpenAI " + err,
        });
    }
}

const requestTranscript = async (req, res) => {
    try {
        const whisperTime = process.hrtime();
        await uploadFile(req, res);
        
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        const transcription = await openaiClient.audio.transcriptions.create({
            model: process.env.OPENAI_API_WHISPER_MODEL || "whisper-1",
            //file: fs.createReadStream('/tmp/tmp.webm'),
            file: fs.createReadStream(__basedir + `/${historyDir}/${req.body.id}_` + req.file.originalname), 
          });

          console.log(`openai.whisper (${req.file.originalname}), transcripted in ${process.hrtime(whisperTime)}: ${transcription?.text}`);
      
          res.send(transcription?.text);
    } catch (err) {
        console.log(err);
        
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }
        
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
}

const requestTextToSpeech = async (req, res) => {
    try {
        const voice = req.body.voice || "alloy";
        const fileName = `${req.body.id}_${voice}.mp3`;
        const speechFile = path.resolve(__basedir + `/${historyDir}/${fileName}`);
        const mp3 = await openaiClient.audio.speech.create({
            model: process.env.OPENAI_API_TTS_MODEL || "tts-1",
            voice: voice,
            input: req.body.input,
          });
          console.log(`openai.file: ${fileName}`);
          const buffer = Buffer.from(await mp3.arrayBuffer());
          await fs.promises.writeFile(speechFile, buffer);

          res.download(speechFile, speechFile, (err) => {
              if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                });
              }
          });
    } catch (err) {
        console.log(err);

        res.status(500).send({
            message: `Could not convert text to speech: ${req.body.input}. ${err}`,
        });
    }
}

module.exports = {
    requestTranscript,
    requestContent,
    requestTextToSpeech,
};