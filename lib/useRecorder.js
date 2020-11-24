import { useEffect, useState, useRef } from 'react';

const useRecorder = () => {
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef();

  const onRecordingReady = (event) => {
    setAudioURL(URL.createObjectURL(event.data));
  };

  useEffect(() => {
    // get audio stream from user's mic
    navigator.mediaDevices
      .getUserMedia({
        audio: true
      })
      .then(function (stream) {
        console.log('ready to record!');
        recorder.current = new MediaRecorder(stream);
        // listen to dataavailable, which gets triggered whenever we have
        // an audio blob available
        recorder.current.addEventListener('dataavailable', onRecordingReady);
      })
      .catch((err) => console.error('getUserMedia failed:', err.name));
  }, []);

  const startRecording = () => {
    if (recorder.current) {
      recorder.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stop();
      setIsRecording(false);
    }
  };

  // set audioURL to "delete" the audio
  const deleteAudio = () => {
    URL.revokeObjectURL(audioURL); // frees up memory
    setAudioURL('');
  };

  return [audioURL, isRecording, startRecording, stopRecording, deleteAudio];
};

export default useRecorder;
