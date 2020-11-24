import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/core';
import { MdInsertPhoto } from 'react-icons/md';

import ImageUploader from 'components/ImageUploader';

function UploadDialog({ onDone }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('gray.900', 'white');

  const onCompleted = (picUrl) => {
    if (picUrl && onDone) onDone(picUrl);
    onClose();
  };

  return (
    <>
      <MenuItem
        onClick={onOpen}
        variant="ghost"
        icon={<MdInsertPhoto size={24} />}>
        Send Image
      </MenuItem>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent bg={bg} color={color}>
            <ModalHeader>Upload Image</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isOpen && <ImageUploader onDone={onCompleted} />}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
export default UploadDialog;
