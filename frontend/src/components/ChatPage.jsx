import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { MessageCircle } from 'lucide-react';
import Messages from './Messages';
import { toast } from 'sonner';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

function ChatPage() {
  const [textMessage, setTextMessage] = useState('');
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const SendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://instragramcopy.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setTextMessage('');
      if (res.data.message) {
        dispatch(setMessages([...(messages || []), res.data.newMessage]));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen bg-white dark:bg-[#0f0f0f] text-gray-800 dark:text-gray-200 border-l border-r border-gray-200 dark:border-gray-800">
      <aside className="w-[320px] border-r px-4 py-6 bg-gray-50 dark:bg-[#161616] border-gray-300 dark:border-gray-800">
        <div className="flex items-center gap-2 justify-center mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="font-bold text-2xl">{user?.username}</h1>
        </div>
        <hr className="mb-6 border-gray-300 dark:border-gray-700" />
        <div className="overflow-y-auto h-[80vh] space-y-1 pr-1">
          {Array.isArray(suggestedUsers) &&
            suggestedUsers.map((suggestedUser, index) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  key={index}
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className={`flex items-center gap-4 p-3 rounded-lg transition cursor-pointer ${
                    selectedUser?._id === suggestedUser._id
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : 'hover:bg-gray-100 dark:hover:bg-[#222]'
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>
                      {suggestedUser?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">{suggestedUser?.username}</span>
                    <span
                      className={`text-xs w-fit mt-1 px-2 py-0.5 rounded-full ${
                        isOnline
                          ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300'
                          : 'bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300'
                      }`}
                    >
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </aside>

      {selectedUser ? (
        <section className="flex-1 flex flex-col h-full">
          <div className="flex gap-3 items-center px-4 py-3 border-b bg-white dark:bg-[#0f0f0f] dark:border-gray-800 sticky top-0 z-10 shadow-sm">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>
                {selectedUser?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{selectedUser?.username}</span>
              <span
                className={`text-xs ${
                  onlineUsers.includes(selectedUser?._id)
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {onlineUsers.includes(selectedUser?._id) ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50 dark:bg-[#121212] text-sm text-center text-gray-500 dark:text-gray-400">
            <Messages selectedUser={selectedUser} />
          </div>

          <div className="flex items-center px-4 py-3 border-t bg-white dark:bg-[#0f0f0f] dark:border-gray-800">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 bg-gray-100 dark:bg-[#222] text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600"
              placeholder="Type a message..."
            />
            <button
              onClick={() => SendMessageHandler(selectedUser?._id)}
              className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
            >
              Send
            </button>
          </div>
        </section>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
          <MessageCircle className="w-24 h-24 mb-4 text-gray-400 dark:text-gray-600" />
          <h2 className="text-xl font-semibold mb-1">Your Messages</h2>
          <p className="text-sm">Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
