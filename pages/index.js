import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, useColorMode, Spinner } from '@chakra-ui/core';

import Layout from 'components/Layout';
import SignUpForm from 'components/SignUpForm';
import SignInForm from 'components/SignInForm';

import { AuthContext, reset, setAuth } from 'lib/AuthContext';
import * as api from 'lib/api';
import { getBg, checkIfExpired } from 'lib/utils';

const Home = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(AuthContext);
  const { auth } = state;
  const [showLoginForm, showLogin] = useState(true);
  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';
  const bg = getBg();

  const getProfile = async () => {
    try {
      const profile = await api.getProfile();
      if (profile?.data) {
        dispatch(setAuth(profile.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (auth) {
      const isExpired = checkIfExpired(auth.token);
      if (isExpired) {
        dispatch(reset());
      } else {
        router.push('/chat');
      }
    }
  }, [auth]);

  return (
    <Layout>
      <Box
        d="flex"
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        backgroundImage={`url('${bg}')`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        overflow="hidden">
        {auth && <Spinner />}
        {!auth && (
          <Box
            overflowY="auto"
            borderWidth="1px"
            borderRadius="lg"
            py={4}
            px={6}
            boxShadow="base"
            minW="320px"
            bg={isLight ? '#fff' : '#1E212E'}
            width={[
              '100%', // 0-30em
              '450px' // 30em-48em
            ]}>
            {showLoginForm ? (
              <SignInForm handleSwitch={() => showLogin(false)} />
            ) : (
              <SignUpForm handleSwitch={() => showLogin(true)} />
            )}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Home;
