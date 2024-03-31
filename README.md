# openai_client_backend
RESTfull API to communicate with OpenAI
currently implemented folowing calls:
- POST /transcript
```
id=<unique id for linking question and answer>&file=<audiofile with request to be transcripted>
```
Returns: transcripted text from audiofile

- POST /request_context
```
{
    "id": <same id as in transcript call>,
    "content": "<transcripted question from previous call>"
}
```
Returns: answer from openai

- POST /texttospeech
```
{
    "id": <same id as in previous calls>,
    "input": "<answer from openai to generate speech audio file>"
    "voice": "<see openai docu. ex: nova>"
}
```
Returns: answer from openai as mp3 file

- GET /history
Returns: JSON array with filenames from history directory

create file openai.env with:
```
OPENAI_API_KEY=<paste your api key here>
OPENAI_API_CHAT_COMPLETIONS_MODEL=gpt-3.5-turbo
OPENAI_API_WHISPER_MODEL=whisper-1
OPENAI_API_TTS_MODEL=tts-1
```

create file .env with:
```
HOST=http://127.0.0.1
PORT=8080
HISTORIE_DIR_NAME=history
```

create directory history (as configured in .env)

start docker service
```
sudo systemctl start docker
```

build and run the server
```
sudo docker build -t openai_client_backend . && sudo docker run --name openaiclient -p 8080:8080 -it openai_client_backend
```

stop the container
```
docker kill openaiclient
```