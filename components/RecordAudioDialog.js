import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  MenuItem,
  Text,
  useColorModeValue
} from '@chakra-ui/core';
import { MdMic } from 'react-icons/md';
import { isIE, isSafari, isMobileSafari } from 'react-device-detect';

import MessageRecorder from 'components/MessageRecorder';

function RecordAudioDialog({ onDone }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('gray.900', 'white');
  const notSupported = isIE || isSafari || isMobileSafari;

  const onSend = async (remoteAudioUrl) => {
    if (remoteAudioUrl && onDone) {
      onDone(remoteAudioUrl);
    }
    onClose();
  };

  return (
    <>
      <MenuItem onClick={onOpen} variant="ghost" icon={<MdMic size={24} />}>
        Send Vocal
      </MenuItem>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent bg={bg} color={color}>
            <ModalHeader>Rec Audio Message</ModalHeader>
            <ModalCloseButton />
            <ModalBody style={{ minHeight: '300px' }}>
              {notSupported && (
                <Text>
                  Sorry... your browser does not support MediaRecorder API
                </Text>
              )}
              {!notSupported && isOpen && (
                <MessageRecorder onDone={(audioUrl) => onSend(audioUrl)} />
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
export default RecordAudioDialog;
