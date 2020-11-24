import React, { createContext, useReducer } from 'react';

export const actionsTypes = {
  TOGGLE_DRAWER: 'TOGGLE_DRAWER',
  SET_CURRENT_ROOM: 'SET_CURRENT_ROOM',
  SET_ROOM_LIST: 'SET_ROOM_LIST',
  ADD_ROOM: 'ADD_ROOM',
  SET_PLAYERS: 'SET_PLAYERS',
  ADD_PLAYER: 'ADD_PLAYER'
};

function reducer(state, action) {
  const { type, data } = action;
  switch (type) {
    case actionsTypes.TOGGLE_DRAWER:
      return {
        ...state,
        drawer: !state.drawer
      };

    case actionsTypes.SET_CURRENT_ROOM:
      return {
        ...state,
        room: data
      };
    case actionsTypes.SET_ROOM_LIST:
      return {
        ...state,
        rooms: data
      };

    case actionsTypes.ADD_ROOM:
      return {
        ...state,
        rooms: [...state.rooms, data]
      };

    case actionsTypes.SET_PLAYERS:
      return {
        ...state,
        players: data
      };

    case actionsTypes.ADD_PLAYER:
      return {
        ...state,
        players: [...state.players, data]
      };
    default:
      return state;
  }
}

const initialState = {
  drawer: false,
  room: null,
  rooms: [],
  players: [],
  newRoom: null
};
const DataContext = createContext();

function DataProvider(props) {
  const [ctxData, updateData] = useReducer(reducer, initialState);
  return (
    <DataContext.Provider value={{ ctxData, updateData }}>
      {props.children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
