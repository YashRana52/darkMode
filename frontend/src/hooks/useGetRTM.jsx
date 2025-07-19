import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector(store => store.socketio);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      dispatch(prev => {
        const currentMessages = prev.chat.messages;
        return setMessages([...currentMessages, newMessage]);
      });
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);
};

export default useGetRTM;
