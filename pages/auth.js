import React, { useContext, useEffect } from 'react';
import { Spinner } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import * as api from 'lib/api';
import { AuthContext, setAuth } from 'lib/AuthContext';

const Auth = () => {
  const router = useRouter();
  const { query } = router;
  const { dispatch } = useContext(AuthContext);

  const getData = async (code) => {
    const result = await api.fbAuth({ code });
    if (result?.data) {
      dispatch(setAuth(result.data));
      router.push('/chat');
    }
  };

  useEffect(() => {
    if (query && query.code) {
      getData(query.code);
    }
  }, [query]);

  return <Spinner />;
};

export default Auth;
