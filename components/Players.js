import React from 'react';
import { Box, Avatar, AvatarGroup } from '@chakra-ui/core';

const Players = ({ players }) => (
  <Box>
    {players && (
      <AvatarGroup size="sm" max={10}>
        {players.reverse().map((player) => {
          const { _id, nick, pic } = player;
          return <Avatar key={_id} name={nick} src={pic} />;
        })}
      </AvatarGroup>
    )}
  </Box>
);

export default Players;
