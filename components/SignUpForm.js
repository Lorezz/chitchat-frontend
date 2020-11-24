import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
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

import { AuthContext, setAuth } from 'lib/AuthContext';
import * as api from 'lib/api';
import { getGravatarUrl } from 'lib/gravatar';
import Socials from 'components/Socials';

export default function SignUpForm({ handleSwitch }) {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function equalTo(ref, msg) {
    return yup.mixed().test({
      name: 'equalTo',
      exclusive: false,
      message: msg || '${path} must be the same as ${reference}',
      params: {
        reference: ref.path
      },
      test(value) {
        return value === this.resolve(ref);
      }
    });
  }
  yup.addMethod(yup.string, 'equalTo', equalTo);

  const schema = yup.object().shape({
    nick: yup
      .string()
      .required('Rquired')
      .min(3, `This has to be at least ${3} characters`),
    email: yup
      .string()
      .email('Please provide a valid email')
      .required('Rquired'),
    password: yup
      .string()
      .required('Required')
      .min(7, `This has to be at least ${7} characters`),
    confirmPassword: yup
      .string()
      .equalTo(yup.ref('password'), 'Passwords must match')
      .required('Required')
  });

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });

  const signUp = async (data) => {
    try {
      const { email } = data;
      const pic = getGravatarUrl(email);
      const result = await api.signUp({ ...data, pic });

      //auto login
      // if (result?.data?.token) {
      //   dispatch(setAuth(result.data));
      // } else if (result?.data?.error) {
      //   setError(result.data.error);
      // }

      if (result?.data?.error) {
        setError(result.data.error);
      } else {
        router.push(`/verify?email=${email}`);
      }
    } catch (error) {
      console.error(error);
      setError('Error registering user');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    setLoading(true);
    setError(null);
    signUp(data);
  };

  return (
    <>
      <Box>
        <center>
          <Text fontSize="xl" fontWeight="medium" mb="10px">
            Sign Up
          </Text>
        </center>
        <Divider mb="20px" />

        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mx={2}>{error}!</AlertTitle>
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.nick} mt={4}>
            <FormLabel htmlFor="nick">Nick Name</FormLabel>
            <Input type="text" name="nick" placeholder="nick" ref={register} />
            <FormErrorMessage>
              {errors.nick && errors.nick.message}
            </FormErrorMessage>
          </FormControl>

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
            <FormLabel htmlFor="password">Password</FormLabel>
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

          <FormControl isInvalid={errors.confirmPassword} mt={4}>
            <FormLabel htmlFor="confirmPassword">
              Password Confirmation
            </FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="confirmPassword"
              ref={register}
            />
            <FormErrorMessage>
              {errors.confirmPassword && errors.confirmPassword.message}
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
            Already registered?
            <Button size="small" p="1" ml="1" onClick={() => handleSwitch()}>
              Sign In
            </Button>
          </Text>
        </center>
      </Box>
      <Divider />
      <Socials />
    </>
  );
}
