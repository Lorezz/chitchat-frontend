import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Box,
  Text,
  Divider,
  Spinner,
  Alert,
  AlertTitle,
  AlertIcon
} from '@chakra-ui/core';

import * as api from 'lib/api';
import { AuthContext, setAuth } from 'lib/AuthContext';
import Socials from 'components/Socials';

export default function SignInForm({ handleSwitch }) {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Please provide a valid email')
      .required('Rquired'),
    password: yup.string().required('Required')
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });

  const signIn = async (formData) => {
    try {
      const result = await api.signIn(formData);

      if (result?.data?.user) {
        dispatch(setAuth(result.data));
      } else if (result?.data?.error) {
        const { error } = result.data;
        if (error.indexOf('confirm') > 0) {
          setTimeout(() => {
            router.push(`/verify?email=${formData.email}`);
          }, 2000);
        }
        setError(error);
      }
    } catch (error) {
      console.error(error);
      setError('Autentication Error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    setLoading(true);
    setError(null);
    signIn(data);
  };

  return (
    <>
      <Box maxHeight="100%" overflow="auto">
        <center>
          <Text fontSize="xl" fontWeight="medium" mb="10px">
            Sign In
          </Text>
        </center>
        <Divider mb="40px" />
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mx={2}>{error}!</AlertTitle>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email} mt={4}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="email"
              ref={register}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password} mt={4}>
            <FormLabel htmlFor="password">password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="password"
              ref={register}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          {!loading && (
            <Button mt={4} type="submit" width="100%">
              Submit
            </Button>
          )}
          {loading && <Spinner />}
        </form>

        <center>
          <Text mt="10" mb="5">
            Not registered yet ?
            <Button size="small" p="1" ml="1" onClick={() => handleSwitch()}>
              Sign Up
            </Button>
          </Text>
        </center>
      </Box>
      <Divider />
      <Socials />
    </>
  );
}
