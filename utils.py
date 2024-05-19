import docx2txt
import os
import logging
from pydub import AudioSegment, utils

# windows : https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip
# for linux apt install ffmpeg
def get_prober_name():
    return "D://ffmpeg/bin/ffprobe.exe"

AudioSegment.converter = "D://ffmpeg/bin/ffmpeg.exe"                  
utils.get_prober_name = get_prober_name


from model_service import text_to_speech

def doc_to_text_catdoc(filename):
    text = docx2txt.process(filename)
    return text


def feed_model(text, id):
    first = True
    i = 0
    print(len(text))
    print(text)
    for line in text:
        print(line)
        if first:
            text_to_speech(line, f"{id}_next{i}")    # Creating first file
            i+=1
            first = False
        else:
            text_to_speech(line, f"{id}_next{i}")
            i+=1
    

    
def split_string(my_string):
    # Split the string by periods first
    words = my_string.split(" ")
    i = 0

    text = []
    phrase = ""
    for word in words:
        if i<8:
            phrase += word + " "
            i += 1
        else:
            text.append(phrase)
            phrase = ""
            i = 0
    text.append(phrase)

    return text

def get_file_format(filename):
    try:
        parts = filename.rsplit(".", 1)
        if len(parts) == 2:
            return "."+ parts[1].lower()  # Return format in lowercase
        else:
            return None
    except Exception as e:
        logging.error(f"error: {e}")



def process_file(filename, file_id):
    text = doc_to_text_catdoc(f"uploads/{filename}")
    text = split_string(text)
    feed_model(text, file_id)
    combine_audio(file_id, len(text))


def combine_audio(file_id, phrasecount):
    # Define the output filename
    output_file = f"audio/{file_id}.wav"

    # Create an empty sound segment to hold the combined audio
    combined = AudioSegment.empty()

    # Loop through each WAV file
    for i in range(phrasecount):
        filename = f"audio/{file_id}_next{i}.wav"
    
        # Open the current WAV file
        sound = AudioSegment.from_wav(filename)
        
        # Append the current WAV file to the combined sound
        combined = combined + sound

        os.remove(filename)

    # Export the combined sound to a new WAV file
    combined.export(output_file, format="wav")

    print(f"Combined audio files saved to: {output_file}")

