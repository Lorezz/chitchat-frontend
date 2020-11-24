import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Text,
  Button,
  useColorMode,
  Divider,
  Spinner,
  PinInput,
  PinInputField,
  Alert,
  AlertTitle,
  AlertIcon
} from '@chakra-ui/core';
import * as yup from 'yup';

import Layout from 'components/Layout';
import { AuthContext, setAuth } from 'lib/AuthContext';
import * as api from 'lib/api';
import { getBg } from 'lib/utils';

const bg = getBg();

const Verify = () => {
  const router = useRouter();
  const { query } = router;
  const [code, setCode] = useState(null);
  const [email, setEmail] = useState(null);
  const [init, setInit] = useState(false);
  const [value, setValue] = useState(null);

  const { state, dispatch } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = state?.auth;

  const DIGITS = 6;

  const schema = yup
    .string()
    .required()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(DIGITS, `Must be exactly ${DIGITS} digits`)
    .max(DIGITS, `Must be exactly ${DIGITS} digits`);

  const validate = (v) => {
    try {
      schema.validateSync(v);
      return 'ok';
    } catch (err) {
      console.log(v, err.message);
      return err.message;
    }
  };

  const { colorMode } = useColorMode();
  const isLight = colorMode === 'light';

  useEffect(() => {
    if (!init && query) {
      const { code: qc, email: qe } = query;
      if (qe) {
        setEmail(qe);
        if (qc) {
          setCode(qc);
          setValue(qc);
        }
        setInit(true);
      }
    }
  }, [query, init]);

  useEffect(() => {
    if (auth) {
      router.push('/chat');
    }
  }, [auth, router]);

  const doVerify = async () => {
    setLoading(true);
    try {
      const data = { email, code: value };
      const result = await api.verify({ data });
      // console.log('====================================');
      // console.log('RESULT', result);
      // console.log('====================================');
      if (result?.data?.token) dispatch(setAuth(result.data));
    } catch (e) {
      console.error(e);
      setError('Code is not valid');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const valid = validate(value);
    // console.log('valid?', valid === 'ok');
    if (valid !== 'ok') {
      setError(valid);
      return;
    }
    doVerify();
  };

  const handleChange = (v) => {
    setError('');
    setValue(v);
  };

  if (!init) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

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
            <center>
              <Text fontSize="xl" fontWeight="medium" mb={2}>
                Verify Email
              </Text>
            </center>
            <Divider my={2} />
            <form onSubmit={onSubmit}>
              <Box d="flex" justifyContent="center" my={6}>
                <PinInput
                  defaultValue={code}
                  size="lg"
                  onChange={(nuVal) => handleChange(nuVal)}
                  padding="10px">
                  <PinInputField mx={1} />
                  <PinInputField mx={1} />
                  <PinInputField mx={1} />
                  <PinInputField mx={1} />
                  <PinInputField mx={1} />
                  <PinInputField mx={1} />
                </PinInput>
              </Box>
              <Divider my={2} />
              <Box
                d="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column">
                {error && (
                  <Alert status="error" my={2}>
                    <AlertIcon />
                    <AlertTitle mx={2}>{error}!</AlertTitle>
                  </Alert>
                )}
                {!loading && (
                  <Button mt={4} type="submit">
                    SUBMIT
                  </Button>
                )}
                {loading && <Text textAlign="center">...Verifyng</Text>}
              </Box>
            </form>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default Verify;
