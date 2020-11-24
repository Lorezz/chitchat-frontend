import { useEffect, useContext, memo } from 'react';
import {
  Box,
  Text,
  Button,
  useBreakpointValue,
  Divider
} from '@chakra-ui/core';
import { MdMenu } from 'react-icons/md';

import Players from 'components/Players';
import * as api from 'lib/api';
import { AuthContext } from 'lib/AuthContext';
import { DataContext, actionsTypes } from 'lib/DataContext';

const HeaderBar = memo(({ roomName, room, toggleMenu, players, requery }) => {
  const { updateData } = useContext(DataContext);
  const { state } = useContext(AuthContext);
  const token = state?.auth?.token;
  const roomId = room?._id;
  const isSM = useBreakpointValue({ base: true, md: false });

  const getPlayers = async (id) => {
    if (id && token) {
      updateData({
        type: actionsTypes.SET_PLAYERS,
        data: []
      });
      const response = await api.getPlayers(id, token);
      if (response.data) {
        updateData({
          type: actionsTypes.SET_PLAYERS,
          data: response.data.people
        });
      }
    }
  };

  useEffect(() => {
    if (roomId) {
      getPlayers(roomId);
    }
  }, [roomId, requery]);

  return (
    <Box d="flex" px="6" py="2" width="100%" flexDirection="column">
      <Box
        d="flex"
        px="6"
        py="2"
        width="100%"
        alignItems="center"
        justifyContent="space-between">
        <Box maxWidth="250px">
          <Text
            color="grey.900"
            size="md"
            mb="1"
            fontWeight="extrabold"
            textTransform="capitalize">
            #{roomName}
          </Text>
        </Box>
        {/* <Input type="search" placeholder="Search" p="2" size="sm" /> */}
        <Box
          alignSelf="flex-end"
          w="50px"
          hidden={!isSM}
          d="flex"
          alignItems="center"
          justifyContent="center">
          <Button variant="outline" onClick={toggleMenu}>
            <MdMenu size={24} />
          </Button>
        </Box>
      </Box>
      <Box d="flex" px="6" py="2" width="100%">
        <Text
          color="grey.500"
          fontWeight="thin"
          text="sm"
          textTransform="capitalize">
          {room?.description || `You are in the room #${roomName}.`}
        </Text>

        <Box
          flex="1"
          d="flex"
          alignItems="center"
          justifyContent="flex-end"
          pr={2}>
          <Players players={players} />
        </Box>
      </Box>
      <Divider />
    </Box>
  );
});
export default HeaderBar;
