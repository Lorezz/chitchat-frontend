import React, { useState } from 'react';
import { Box, Input, Text, Divider } from '@chakra-ui/core';

import AddRoomDialog from 'components/AddRoomDialog';
import Square from 'components/Square';

const Sidebar = ({
  roomName,
  rooms,
  handleChangeRoom,
  drawer,
  handleClose
}) => {
  const [filter, setFilter] = useState('');
  const props = drawer
    ? { mt: '45px', mx: 0 }
    : {
        width: '20vw',
        minW: '250px',
        pt: 5,
        pb: 10,
        borderRight: '1px solid rgba(255, 255, 255, 0.16)'
      };

  const changeRoom = (id) => {
    handleChangeRoom(id);
    if (handleClose) handleClose();
  };

  const filterRooms = (list) => {
    if (!filter) return list.filter((r) => !!r);
    return rooms.filter((room) => room && room.name.includes(filter));
  };

  return (
    <Box d="flex" flexDirection="column" overflow="hidden" {...props}>
      <Box
        mb={5}
        px={3}
        d="flex"
        alignItems="center"
        justifyContent="space-between">
        <Text fontWeight="bold">ROOMS</Text>
        <AddRoomDialog />
      </Box>
      <Box mb={5} px={3}>
        <Input
          name="search"
          type="search"
          placeholder="Search..."
          onChange={(e) => setFilter(e.target.value)}
        />
      </Box>
      <Divider mt="5px" />
      <Box mb={20} px={2} overflowY="auto">
        {filterRooms(rooms).map((r) => {
          if (!r) return null;
          const { name, _id } = r;
          const higlight = name === roomName;
          return (
            <Box
              cursor="pointer"
              d="flex"
              alignItems="center"
              mt={2}
              pl={1}
              key={_id}
              onClick={() => changeRoom(_id)}>
              <Square
                name={name}
                bg={higlight ? 'green.300' : ''}
                color={higlight ? 'white' : ''}
              />
              <Text
                variant="outline"
                textTransform="capitalize"
                color={higlight ? 'green.400' : ''}
                p={1}
                style={{
                  whitePpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                {`${name}`}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Sidebar;
