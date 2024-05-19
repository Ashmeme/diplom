import torchaudio
from speechbrain.inference.TTS import FastSpeech2
from speechbrain.inference.vocoders import HIFIGAN

fastspeech2 = FastSpeech2.from_hparams(source="speechbrain/tts-fastspeech2-ljspeech", savedir="pretrained_models/tts-fastspeech2-ljspeech")
hifi_gan = HIFIGAN.from_hparams(source="speechbrain/tts-hifigan-ljspeech", savedir="pretrained_models/tts-hifigan-ljspeech")

def text_to_speech(input_text, filename):
    mel_output, durations, pitch, energy = fastspeech2.encode_text(
    [input_text],
    pace=1.0,        # scale up/down the speed
    pitch_rate=1.0,  # scale up/down the pitch
    energy_rate=1.0, # scale up/down the energy
    )

    waveforms = hifi_gan.decode_batch(mel_output)

    torchaudio.save(f'audio/{filename}.wav', waveforms.squeeze(1), 22050)

