import React, { useEffect, useState, useRef, useContext, memo } from 'react';
import _ from 'lodash';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Spinner,
  useToast,
  useColorModeValue
} from '@chakra-ui/core';
// import { MdCheckCircle } from "react-icons/md";

import {
  initiateSocket,
  subscribeToChat,
  loadInitialChat,
  switchRooms,
  disconnectSocket
} from 'lib/socket';

import SideBar from 'components/SideBar';
import HeaderBar from 'components/HeaderBar';
import Message from 'components/Message';
import MessageBar from 'components/MessageBar';
import { DataContext, actionsTypes } from 'lib/DataContext';

const aMinute = 60 * 1000;

const Chat = memo(({ user, token }) => {
  const toast = useToast();
  const { ctxData, updateData } = useContext(DataContext);
  const { room, rooms, players } = ctxData;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messages, setMessages] = useState([]);
  const [requery, setRequery] = useState(null);
  const [start, setStart] = useState(Date.now());
  const messageBoxRef = useRef();
  const isSM = useBreakpointValue({ base: true, md: false });

  const changeRoom = (id) => {
    // CHANGE ROOM, id
    updateData({
      type: actionsTypes.SET_CURRENT_ROOM,
      data: id
    });
  };

  // Keep a ref to prev room
  const prevRoomRef = useRef();
  useEffect(() => {
    prevRoomRef.current = room;
  });
  const prevRoom = prevRoomRef.current;

  // Initiate or Switch Rooms depending on previous and current values
  useEffect(() => {
    setMessages([]);
    if (prevRoom) {
      if (prevRoom != room) {
        // SWITCH ROOM
        switchRooms(prevRoom, room);
      }
    } else if (room) {
      // INIT CHAT
      setStart(Date.now());
      initiateSocket(room, user._id, token);
      loadInitialChat((err, data) => {
        if (err) {
          console.error('Error on loadInitialChat', error);
          return;
        }
        if (data.messages) {
          setMessages(data.messages);
          handleReceieMessage();
        }
      });
    }
  }, [room, prevRoom]);

  // Subscribe only once to event as socket is reused
  useEffect(() => {
    // SUBSCRIBE
    subscribeToChat((disconnect, msg, newRoom, newPlayer) => {
      if (disconnect) {
        console.log('diconnected', start);
        if (Date.now() - start > aMinute) {
          toast({
            title: 'Ops...',
            description: 'You have been disconnected!',
            status: 'error',
            duration: null, //sticky
            isClosable: true,
            position: 'top-right',
            onClose: () => {
              document.location.reload();
            }
          });
        }
        return;
      }
      if (msg) {
        // TODO splice first N message, were N = MAX - PREV.LEN+1
        setMessages((prev) => [...prev, msg]);
        handleReceieMessage();
      }

      if (newRoom) {
        const exists = rooms.find((r) => r._id === newRoom._id);
        if (!exists) {
          updateData({ type: actionsTypes.ADD_ROOM, data: newRoom });
        } else {
          console.log('newRoom already exists');
        }
      }

      if (newPlayer) {
        const exists = players.find((r) => r._id === newPlayer._id);
        if (!exists) {
          updateData({ type: actionsTypes.ADD_PLAYER, data: newPlayer });
        } else {
          console.log('newPlayer already exists');
        }
        setRequery(Date.now());
      }
    });
    return () => {
      disconnectSocket();
      console.log('bye');
    };
  }, []);

  const handleReceieMessage = () => {
    try {
      if (messageBoxRef && messageBoxRef.current) {
        messageBoxRef.current.scrollTop =
          messageBoxRef.current.scrollHeight + 200;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // TOREMOVE now trigger when I receive a message instead
  const handleSentMessage = () => {
    // messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight + 200;
  };

  const roomData = rooms.filter((r) => !!r).find((r) => r._id === room);
  if (!roomData) {
    return <Spinner />;
  }

  const bg = useColorModeValue('#white', 'gray.900');
  const color = useColorModeValue('gray.900', 'white');
  // const boxBg = useColorModeValue('white', 'gray.900');
  // const boxColor = useColorModeValue('gray.900', 'white');

  return (
    <Box d="flex" justifyContent="flex-start" flex="1" maxHeight="100%">
      <Drawer isOpen={isSM && isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent bg={bg} color={color}>
            <DrawerCloseButton />
            <DrawerBody mx={-4}>
              <SideBar
                roomName={roomData?.name}
                rooms={rooms}
                handleChangeRoom={(id) => changeRoom(id)}
                drawer
                handleClose={() => onClose()}
              />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      {!isSM && (
        <SideBar
          roomName={roomData?.name}
          rooms={rooms}
          handleChangeRoom={(id) => changeRoom(id)}
          drawer={false}
        />
      )}

      <Box
        d="flex"
        flexDirection="column"
        flex="1"
        overflow="hidden"
        maxHeight="90vh"
        boxShadow="base">
        <HeaderBar
          roomName={roomData?.name}
          room={roomData}
          toggleMenu={onOpen}
          players={players}
          requery={requery}
        />
        <Box px="6" py="4" overflowY="scroll" flex="1" ref={messageBoxRef}>
          {messages.map((m) => (
            <Message key={m._id} data={m} />
          ))}
        </Box>
        <MessageBar room={room} onSent={() => console.log('msg sent')} />
      </Box>
    </Box>
  );
});

export default Chat;
