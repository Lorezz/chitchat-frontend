import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  // ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Input,
  Button,
  useDisclosure,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Alert,
  AlertTitle,
  AlertIcon,
  Box,
  useColorModeValue
} from '@chakra-ui/core';
import { MdAdd } from 'react-icons/md';

import * as api from 'lib/api';
import { DataContext, actionsTypes } from 'lib/DataContext';
import { notifyNewRoom } from 'lib/socket';

function AddRoomDialog() {
  const { updateData } = useContext(DataContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Rquired')
      .min(5, `This has to be at least ${5} characters`)
      .max(15, `This has to be ${15} characters max`),
    description: yup.string()
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });

  const addRoom = async (payload) => {
    try {
      const result = await api.addRoom({ data: payload });
      if (result?.error) {
        setError(result.error);
      } else if (result?.data) {
        const { data } = result;
        console.log('newroom', data);
        updateData({ type: actionsTypes.ADD_ROOM, data });
        if (data._id) {
          notifyNewRoom(data._id);
          updateData({
            type: actionsTypes.SET_CURRENT_ROOM,
            data: data._id
          });
        }
        onClose();
      }
    } catch (e) {
      console.error(e);
      setError('Error creating room');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    setLoading(true);
    setError(null);
    addRoom(data);
  };
  const bg = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('gray.900', 'white');

  return (
    <>
      <Button onClick={onOpen} variant="outline" size="sm" p="2px">
        <MdAdd size={24} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg={bg}
            color={color}>
            <ModalHeader>Create New Room</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mb="20px">
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mx={2}>{error}!</AlertTitle>
                  </Alert>
                )}
                <FormControl isInvalid={errors.name} mt={4}>
                  <FormLabel htmlFor="name">Room Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    placeholder="name"
                    ref={register}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.description} mt={4}>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Input
                    type="textarea"
                    name="description"
                    placeholder="description"
                    ref={register}
                  />
                  <FormErrorMessage>
                    {errors.description && errors.description.message}
                  </FormErrorMessage>
                </FormControl>

                {!loading && (
                  <Button mt={4} type="submit" width="100%">
                    Submit
                  </Button>
                )}
                {loading && (
                  <center>
                    <Spinner mt="10px" />
                  </center>
                )}
              </Box>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
export default AddRoomDialog;
