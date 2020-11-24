import React, { useEffect, useState, useContext } from 'react';
import { Box, Spinner } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import Layout from 'components/Layout';
import Chat from 'components/Chat';
import * as api from 'lib/api';
import { AuthContext, reset } from 'lib/AuthContext';
import { DataContext, actionsTypes } from 'lib/DataContext';
import { checkIfExpired } from 'lib/utils';

const ChatPage = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(AuthContext);
  const { auth } = state;
  const { updateData } = useContext(DataContext);
  const [start, setStart] = useState(false);

  const getData = async () => {
    try {
      const { token } = state.auth;

      if (!token) {
        router.push('/');
        return;
      }
      if (token) {
        const isExpired = checkIfExpired(token);
        if (isExpired) {
          dispatch(reset());
          router.push('/');
          return;
        }
      }

      const roomsListData = await api.getRooms(token);
      const { data } = roomsListData;
      if (data) {
        updateData({ type: actionsTypes.SET_ROOM_LIST, data });
        updateData({ type: actionsTypes.SET_CURRENT_ROOM, data: data[0]._id });
      }
      setStart(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth && !start) {
      getData();
    } else if (!auth) {
      router.replace('/');
    }
  }, [auth, start]);

  if (!start) {
    return (
      <Layout>
        <Box
          d="flex"
          height="auto"
          width="100%"
          flex={1}
          alignItems="center"
          justifyContent="center">
          <Spinner />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Chat user={auth?.user} token={auth?.token} />
    </Layout>
  );
};

export default ChatPage;
