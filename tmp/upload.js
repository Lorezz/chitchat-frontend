import { useState, useCallback } from 'react';
import { Box, Text, Heading, Button, Container, Image } from '@chakra-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Line } from 'rc-progress';
import Layout from 'components/Layout';
import { useDropzone } from 'react-dropzone';
import { MdFileUpload, MdPhoto } from 'react-icons/md';
import { humanFileSize, loadImgFromBlob } from '/lib/utils';
import * as api from 'lib/api';

const { NEXT_PUBLIC_IMGIX_URL } = process.env;

const Upload = () => {
  const [file, setFile] = useState(null);
  const [pic, setPic] = useState(null);
  const [picUrl, setPicUrl] = useState(null);
  const [progress, setProgress] = useState(null);
  const [buffering, setBuffering] = useState(null);
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // console.log('acceptedFiles', acceptedFiles);
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setProgress(null);
      setBuffering(null);
      setPic(null);
      setPicUrl(null);
      setCopied(false);
      loadImgFromBlob(acceptedFiles[0]).then(({ image, dataUrl }) =>
        setPreview(image.src)
      );
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  async function fileUpload(file) {
    try {
      const formData = new FormData();
      formData.append(`file`, file);
      const headers = { 'content-type': 'multipart/form-data' };
      const response = await api.upload(formData, headers);
      const { data } = response;
      if (data?.key) {
        const { key } = data;
        const pic = `${NEXT_PUBLIC_IMGIX_URL}/${key}?w=250&h=250${
          key.includes('.gif') ? '&fit=crop' : '&auto=format,compress'
        }`;
        setPic(pic);
        setPicUrl(`${NEXT_PUBLIC_IMGIX_URL}/${key}`);
      }
    } catch (error) {
      console.error('UPLOAD ERROR', JSON.stringify(error));
      alert('UPLOAD ERROR');
    }
  }

  return (
    <Layout>
      <Container>
        <Box p={10}>
          <Heading>Upload</Heading>
          <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            p={10}
            d="flex"
            alignItems="baseline"
            justifyContent="center">
            <Box {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <div>
                  <MdFileUpload size={240} />
                </div>
              ) : (
                <div>
                  {!pic && !preview && <MdPhoto size={240} />}
                  {!pic && preview && <Image src={preview} width={240} />}
                  {pic && <Image src={pic} width={240} />}
                </div>
              )}
            </Box>
          </Box>

          {buffering && (
            <>
              <p>{'BUFFERING'}</p>
              <Line percent={buffering} strokeWidth="2" strokeColor="#32d6d6" />
            </>
          )}
          {progress && (
            <>
              <p>{'UPLOADING'}</p>
              <Line percent={progress} strokeWidth="2" strokeColor="#32d6d6" />
            </>
          )}

          {file && (
            <Box p={10}>
              <Text>
                {file.name}
                {' - '}
                {humanFileSize(file.size, true)}
              </Text>
              <Button onClick={() => fileUpload(file)}>Upload</Button>
            </Box>
          )}

          {picUrl && (
            <CopyToClipboard text={picUrl} onCopy={() => setCopied(true)}>
              <Button>{copied ? 'Copied!' : 'Copy'}</Button>
            </CopyToClipboard>
          )}
        </Box>
      </Container>
    </Layout>
  );
};
export default Upload;
