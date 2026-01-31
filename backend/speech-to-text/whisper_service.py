import whisper
import sys
import json
import os

model = whisper.load_model('small')

audio_path = sys.argv[1]

result = model.transcribe(audio_path,language="en",task="transcribe")
text = result["text"].strip()

print(json.dumps({"text" : text}))

os.remove(audio_path)


