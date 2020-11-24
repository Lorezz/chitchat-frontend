import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Spinner,
  Button,
  Alert,
  AlertTitle,
  AlertIcon,
  Box,
  Text,
  useTheme
} from '@chakra-ui/core';
import { motion } from 'framer-motion';
// import { MdMic, MdFiberManualRecord, MdStop } from 'react-icons/md';

import * as api from 'lib/api';
import useRecorder from 'lib/useRecorder';

const percents = 100;
const radius = 45;
const circumference = Math.ceil(2 * Math.PI * radius);
const fillPercents = Math.abs(
  Math.ceil((circumference / 100) * (percents - 100))
);

const transition = {
  duration: 10, //seconds
  delay: 0,
  ease: 'linear'
};

const variants = {
  notRecording: {
    strokeDashoffset: circumference
  },
  recording: {
    strokeDashoffset: fillPercents,
    transition
  }
};

function MessageRecorder({ onDone }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forceStop, setForceStop] = useState(false);
  const ref = useRef(null);

  const [
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    deleteAudio
  ] = useRecorder();
  const theme = useTheme();

  const saveAudio = async () => {
    setError(null);
    setLoading(true);
    try {
      const repsonse = await fetch(audioURL);
      const blob = await repsonse.blob();
      const formData = new FormData();
      formData.append('audio', blob);
      const headers = { 'content-type': 'multipart/form-data' };
      const response = await api.upload(formData, headers);
      const { data } = response;
      console.log('data', data);
      if (data?.error) {
        setError(data.error);
        return;
      }
      return data?.Location;
    } catch (e) {
      console.log(e);
      setError('Error saving message');
    } finally {
      setLoading(false);
    }
  };

  let title = 'Rec max 10 seconds voice message';
  if (isRecording) {
    title = 'You are recording';
  }
  const isRecordingExists = audioURL !== '';

  const onSend = async () => {
    const remoteAudioUrl = await saveAudio();
    if (remoteAudioUrl) {
      deleteAudio();
      if (onDone) onDone(remoteAudioUrl);
    }
  };

  let timer = null;
  const start = () => {
    if (!isRecording && !forceStop) {
      // console.log('START');
      startRecording();
      timer = setTimeout(() => {
        // console.log('TRIGGER');
        setForceStop(true);
      }, 10500);

      setForceStop(false);
    }
  };

  useEffect(() => {
    if (forceStop) {
      // console.log('FORCE STOP');
      stop();
    }
  }, [forceStop]);

  const stop = () => {
    if (isRecording) {
      // console.log('STOP');
      stopRecording();
    }
    if (timer) {
      clearTimeout(timer);
    }
  };

  const close = () => {
    if (timer) {
      clearTimeout(timer);
    }
    deleteAudio();
    onDone();
  };

  useEffect(() => {
    return () => {
      // console.log('UNMOUNT');
      close();
    };
  }, []);

  return (
    <Box mb="20px">
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mx={2}>{error}!</AlertTitle>
        </Alert>
      )}
      <Box
        d="flex"
        flexDirection="column"
        alignItems="center"
        borderWidth="1px"
        borderRadius="lg"
        py={4}
        px={6}>
        <Text textAlign="center">{title}</Text>
        <motion.svg
          height="100"
          width="100"
          style={{
            transform: 'rotate(-90deg)',
            overflow: 'visible'
          }}>
          <motion.circle
            transform="rotate(-90deg)"
            cx="50"
            cy="50"
            fill={theme.colors.red['500']}
            r={radius}
            strokeWidth={10}
            stroke={theme.colors.red['600']}
            strokeDashoffset={fillPercents}
            strokeDasharray={circumference}
            variants={variants}
            initial="notRecording"
            animate={isRecording ? 'recording' : 'notRecording'}
            onTapStart={() => start()}
            onTap={() => {
              stop();
              setForceStop(false);
            }}
            onTapCancel={() => {
              stop();
              setForceStop(false);
            }}></motion.circle>
        </motion.svg>
        <Text mt={4} mb={2}>
          {isRecording ? 'RECORDING' : 'NOT RECORDING'}
        </Text>
      </Box>
      {loading && (
        <Box>
          <center>
            <Spinner mt="10px" mr={2} /> Uploading...
          </center>
        </Box>
      )}
      <Box d="flex" alignItems="center" justifyContent="center" p={10}>
        <audio
          hidden={isRecordingExists && !isRecording ? false : true}
          controls
          src={audioURL}
          ref={ref}
        />
      </Box>
      {audioURL && (
        <Box d="flex" alignItems="center" justifyContent="space-around">
          <Button onClick={() => close()}>CANCEL</Button>
          <Button onClick={() => onSend()}>SEND</Button>
        </Box>
      )}
    </Box>
  );
}
export default MessageRecorder;
