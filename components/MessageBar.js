import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/core';
import {
  MdSend,
  MdMoreHoriz,
  MdClose
  // MdAttachFile,
  // MdMood,
  // MdCode,
} from 'react-icons/md';

import { sendMessage } from 'lib/socket';
import UploadDialog from 'components/UploadDialog';
import RecordAudioDialog from 'components/RecordAudioDialog';

const MessageBar = ({ room, onSent }) => {
  const [text, setText] = useState('');
  const handleChangeTxt = (e) => {
    const x = e.target.value;
    setText(x);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (text) {
      const message = { text };
      sendMessage(room, message);
    }
    setTimeout(() => {
      setText('');
      onSent && onSent();
    }, 100);
  };

  const handleImage = (pic) => {
    if (pic) {
      const message = { pic };
      sendMessage(room, message);
    }
  };

  const handleAudio = (audio) => {
    if (audio) {
      const message = { audio };
      sendMessage(room, message);
    }
  };

  return (
    <Box py={[2, 4, 6, 8]} justifySelf="flex-end" height="100px">
      <form onSubmit={(e) => onSubmit(e)}>
        <Flex mx={6}>
          <Menu>
            <MenuButton type="button">
              <Button type="button">
                <MdMoreHoriz size={20} />
              </Button>
            </MenuButton>
            <MenuList>
              <UploadDialog onDone={handleImage} />
              <RecordAudioDialog onDone={handleAudio} />
              <MenuDivider />
              <MenuItem icon={<MdClose size={24} />}>Close</MenuItem>
            </MenuList>
          </Menu>

          <Input
            type="textarea"
            value={text}
            onChange={(e) => handleChangeTxt(e)}
            mr={1}
          />
          <Button type="submit">
            <MdSend size={20} pl={1} />
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
export default MessageBar;
