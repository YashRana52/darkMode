import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';


function Messages({ selectedUser }) {
  useGetRTM()
  useGetAllMessage()
      const { messages } = useSelector((store) => store.chat);
      const { user } = useSelector((store) => store.auth);
     
  return (
    <div className="overflow-y-auto flex-1 p-6 bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-200">
      {/* Centered User Info */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>{selectedUser?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-lg font-semibold">{selectedUser?.username}</span>

          <Link to={`/profile/${selectedUser?._id}`}>
            <button className="mt-2 px-4 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer">
              View Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Example Message List */}
      <div className="space-y-4">
         {
                    messages && messages.map((msg) => {
                        return (
                            <div key={msg?._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
                }
      </div>
    </div>
  );
}

export default Messages;
