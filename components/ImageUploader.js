import React, { useState, useCallback, useEffect } from 'react';
import {
  Spinner,
  Button,
  Alert,
  AlertTitle,
  AlertIcon,
  Box,
  Text
} from '@chakra-ui/core';
import { MdFileUpload, MdPhoto } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
// import { Line } from 'rc-progress';
// import { humanFileSize, loadImgFromBlob } from 'lib/utils';
import * as api from 'lib/api';

const { NEXT_PUBLIC_IMGS_URL: IMAGES_URL } = process.env;
const MAX_IMAGE_IN_MB = 2;
const maxSize = MAX_IMAGE_IN_MB * 1024 * 1034;

function ImageUploader({ onDone }) {
  const [pic, setPic] = useState(null);
  const [picUrl, setPicUrl] = useState(null);
  // const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setPic(null);
      setPicUrl(null);
    };
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      console.log('acceptedFiles', acceptedFiles);
      if (acceptedFiles && acceptedFiles.length > 0) {
        setPic(null);
        setPicUrl(null);
        // const { image, dataUrl } = await loadImgFromBlob(acceptedFiles[0]);
        // setPreview(image.src);
        await fileUpload(acceptedFiles[0]);
      }
    } catch (e) {
      console.error('OnDrop Error', e);
    }
  }, []);
  const accept = 'image/*';
  const {
    getRootProps,
    getInputProps,
    isDragActive
    // isDragReject,
    // rejectedFiles
  } = useDropzone({ onDrop, maxSize, accept });

  // const isFileTooLarge =
  //   rejectedFiles &&
  //   rejectedFiles.length > 0 &&
  //   rejectedFiles[0].size > maxSize;

  const onSend = () => {
    if (onDone) onDone(picUrl);
  };

  const getPreviewImageUrl = (key) => {
    // const params = '?w=250&h=250&auto=format,compress';
    const params = '?tr=w-250,h=250';
    console.log('KEY', key);
    return `${IMAGES_URL}/${key}${key.includes('.gif') ? '' : params}`;
  };

  const getPicImageUrl = (key) => {
    // const params = '?w=500&auto=format,compress';
    const params = '?tr=w-500';
    console.log('KEY', key);
    return `${IMAGES_URL}/${key}${key.includes('.gif') ? '' : params}`;
  };

  async function fileUpload(file) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(`file`, file);
      const headers = { 'content-type': 'multipart/form-data' };
      const response = await api.upload(formData, headers);
      const { data } = response;

      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.key) {
        const { key } = data;
        const pic = getPreviewImageUrl(key);
        setPic(pic);
        setPicUrl(getPicImageUrl(key));
      }
    } catch (error) {
      console.error('UPLOAD ERROR', JSON.stringify(error));
      setError('UPLOAD ERROR');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box mb="20px">
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mx={2}>{error}!</AlertTitle>
        </Alert>
      )}

      <Text textAlign="center" mb={2}>
        Click here or drop a file to upload! Max Sixe: {MAX_IMAGE_IN_MB}MB
      </Text>
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        p={10}
        d="flex"
        alignItems="baseline"
        justifyContent="center"
        style={{ minHeight: 250 }}>
        <Box {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <div>
              <MdFileUpload size={240} />
            </div>
          ) : (
            <div>
              {!pic && <MdPhoto size={240} />}
              {/* {!pic && preview && <img src={preview} width={240} />} */}
              {pic && <img src={pic} width={240} />}
            </div>
          )}
        </Box>
      </Box>

      {loading && (
        <center>
          <Spinner mt="10px" /> Uploading...
        </center>
      )}

      {picUrl && (
        <Box d="flex" alignItems="center" justifyContent="space-around">
          <Button onClick={() => onDone && onDone()}>CANCEL</Button>
          <Button onClick={() => onSend()}>SEND</Button>
        </Box>
      )}
    </Box>
  );
}
export default ImageUploader;
