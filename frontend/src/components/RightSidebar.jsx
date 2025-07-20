import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

function RightSidebar() {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-fit my-10 pr-20 text-black dark:text-white">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user?._id}`}onClick={() =>window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
})}>
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} alt="post_img" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}onClick={() => window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
})}</Link>
          </h1>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {user?.bio || 'Bio here...'}
          </span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
}

export default RightSidebar;
