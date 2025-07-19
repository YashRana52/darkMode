import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [],
    selectedUser: null,
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
});

export const { setOnlineUsers, setMessages, addMessage, setSelectedUser } = chatSlice.actions;

export default chatSlice.reducer;
