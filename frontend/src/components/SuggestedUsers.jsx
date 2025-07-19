import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="my-10 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
          Suggested for you
        </h1>
        <span className="text-blue-600 dark:text-blue-400 text-sm cursor-pointer hover:underline">
          See All
        </span>
      </div>

      <div className="space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user._id}`} onClick={() => window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
})}>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user?.profilePicture} alt="profile" />
                  <AvatarFallback>
                    {user?.username?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <Link
                  to={`/profile/${user._id}`}  onClick={() => window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
})}
                  className="font-semibold text-sm hover:underline dark:text-white"
                >
                  {user?.username}
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.bio || 'No bio available'}
                </p>
              </div>
            </div>

            <button className="text-blue-500 dark:text-blue-400 font-semibold text-xs hover:underline">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedUsers;
