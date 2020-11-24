import React, { useEffect, useRef, useState } from 'react';
import {
  Spinner,
  Button,
  useDisclosure,
  Alert,
  AlertTitle,
  AlertIcon,
  Box,
  Text,
  Heading
} from '@chakra-ui/core';
import { MdMic, MdFiberManualRecord, MdStop } from 'react-icons/md';
import { motion } from 'framer-motion';

import * as api from 'lib/api';
import useRecorder from 'lib/useRecorder';

function MessageRecorder({ onDone }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const [
    audioURL,
    isRecording,
    startRecording,
    stopRecording,
    deleteAudio
  ] = useRecorder();

  const saveAudio = async () => {
    setError(null);
    setLoading(true);
    try {
      const repsonse = await fetch(audioURL);
      const blob = await repsonse.blob();
      console.log('BLOB', blob);
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

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const onSend = async () => {
    const remoteAudioUrl = await saveAudio();
    if (remoteAudioUrl) {
      deleteAudio();
      if (onDone) onDone(remoteAudioUrl);
    }
  };

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
        <Heading textAlign="center">{title}</Heading>

        <Button
          margin={'50px'}
          height={100}
          width={100}
          borderRadius="50%"
          backgroundColor={isRecording ? 'red.500' : 'blue.300'}
          _hover={{ bg: 'red.500' }}
          onClick={() => toggleRecording()}>
          {isRecording ? (
            <MdFiberManualRecord size={48} />
          ) : (
            <MdMic size={48} />
          )}
          {isRecording ? 'STOP' : 'START'}
        </Button>

        <Text> {isRecording ? 'RECORDING' : 'NOT RECORDING'}</Text>
      </Box>
      <Box d="flex" alignItems="center" justifyContent="center" p={10}>
        {loading && (
          <>
            <Spinner mt="10px" /> Uploading...
          </>
        )}
        <audio
          hidden={isRecordingExists && !isRecording ? false : true}
          controls
          src={audioURL}
          ref={ref}
        />
      </Box>
      {audioURL && (
        <Box d="flex" alignItems="center" justifyContent="space-around">
          <Button onClick={() => onClose()}>CANCEL</Button>
          <Button onClick={() => onSend()}>SEND</Button>
        </Box>
      )}
    </Box>
  );
}
export default MessageRecorder;
