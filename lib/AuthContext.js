import React, { createContext, useReducer, useEffect, useState } from 'react';

const initialState = {
  auth: null
};

export const actionsTypes = {
  SET_AUTH: 'SET_AUTH',
  RESET: 'RESET',
  INIT: 'INIT'
};

export const setAuth = (data) => ({
  type: actionsTypes.SET_AUTH,
  data
});
export const reset = () => ({
  type: actionsTypes.RESET
});

function reducer(state, action) {
  const { type, data } = action;
  switch (type) {
    case actionsTypes.SET_AUTH:
      return {
        ...state,
        auth: data
      };
    case actionsTypes.RESET:
      return {
        ...initialState
      };
    case actionsTypes.INIT:
      return {
        ...data
      };
    default:
      return state;
  }
}

const AuthContext = createContext();

function AuthProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  /*
  const [isInitialized, setIsInitialized] = useState(false);
  const KEY = '^.^';
  // SAVE STATE IN localStorage
  useEffect(() => {
    if (isInitialized && state && localStorage) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isInitialized, state]);
  // LOAD STATE FROM localStorage
  useEffect(() => {
    let data = null;
    try {
      data = JSON.parse(localStorage.getItem(KEY));
      if (data) dispatch({ type: actionsTypes.INIT, data });
    } catch (e) {
      console.error('session storage get error', e);
    }
    setIsInitialized(true);
  }, []);
*/
  const { children } = props;
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
