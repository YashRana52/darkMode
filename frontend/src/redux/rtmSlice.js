import { createSlice } from "@reduxjs/toolkit";

const rtmSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      const { type, userId } = action.payload;

      if (type === 'like') {
        state.likeNotification.push(action.payload);
      } else if (type === 'unlike') {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== userId
        );
      }
    },
  },
});

export const { setLikeNotification } = rtmSlice.actions;
export default rtmSlice.reducer;
