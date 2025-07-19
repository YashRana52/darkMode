import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import postSlice from './postSlice'
import storage from "redux-persist/lib/storage";
import socketSlice from './socketSlice.js'
import chatSlice from './chatSlice.js'
import rtnSlice from './rtmSlice'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  post:postSlice,
  socketio:socketSlice,
  chat:chatSlice,
  realTimeNotification:rtnSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
