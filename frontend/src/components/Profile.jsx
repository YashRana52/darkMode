import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { CheckCircle, Heart, MessageCircle } from 'lucide-react'

function Profile() {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const [activeTab, setActiveTab] = useState('posts')
  const { userProfile,user } = useSelector((store) => store.auth)

  const isLoggedInUserProfile = user?._id === userProfile?._id
  const isFollowing = false

  const handleTabChange = (tab) => setActiveTab(tab)

  const displayedPost =
    activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-10">
        <div className="flex justify-center">
          <Avatar className="w-32 h-32">
            <AvatarImage src={userProfile?.profilePicture} alt="Profile" />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xl font-semibold">{userProfile?.username}</span>
            <CheckCircle className="text-blue-500 w-5 h-5" />
            {isLoggedInUserProfile ? (
              <>
              <Link to='/account/edit'>
                <Button variant="secondary" className="h-8">Edit Profile</Button>
              </Link>
      
                <Button variant="secondary" className="h-8">View Archive</Button>
                <Button variant="secondary" className="h-8">Ad Tools</Button>
              </>
            ) : isFollowing ? (
              <>
                <Button className="h-8">Unfollow</Button>
                <Button className="h-8">Message</Button>
              </>
            ) : (
              <Button className="h-8">Follow</Button>
            )}
          </div>

          <div className="flex gap-6 text-sm">
            <span><strong>{userProfile?.posts?.length || 0}</strong> posts</span>
            <span><strong>{userProfile?.followers?.length || 0}</strong> followers</span>
            <span><strong>{userProfile?.following?.length || 0}</strong> following</span>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium">{userProfile?.bio || "MERN Stack Developer"}</span>
            <Badge variant="secondary">{userProfile?.username}</Badge>
            <span>Learn code with MERN stack</span>
            <span>Frontend | Backend | Fullstack</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-300 mb-6">
        <div className="flex justify-center gap-10 text-sm text-gray-600 uppercase font-semibold tracking-wide pt-4">
          <span
            className={`cursor-pointer pb-2 ${
              activeTab === 'posts' ? 'border-t-2 border-black text-black' : ''
            }`}
            onClick={() => handleTabChange('posts')}
          >
            Posts
          </span>
          <span
            className={`cursor-pointer pb-2 ${
              activeTab === 'saved' ? 'border-t-2 border-black text-black' : ''
            }`}
            onClick={() => handleTabChange('saved')}
          >
            Saved
          </span>
          <span className="cursor-not-allowed opacity-50">Reels</span>
          <span className="cursor-not-allowed opacity-50">Tagged</span>
        </div>
      </div>

     
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {displayedPost?.length ? (
          displayedPost.map((post) => (
          <div
  key={post?._id}
  className="relative group aspect-square overflow-hidden bg-gray-100"
>
  <img
    src={post.image}
    alt="post"
    className="object-cover w-full h-full group-hover:opacity-80 transition"
  />
<div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[rgba(0,0,0,0.2)] group-hover:bg-[rgba(0,0,0,0.4)] flex items-center justify-center gap-4 text-white transition-all duration-300">

    <div className="flex items-center gap-1">
      <Heart className="w-4 h-4" />
      <span className="text-sm">{post?.likes?.length}</span>
    </div>
    <div className="flex items-center gap-1">
      <MessageCircle className="w-4 h-4" />
      <span className="text-sm">{post?.comments?.length}</span>
    </div>
  </div>
</div>

          ))
        ) : (
          <div className="col-span-3 text-center text-gray-400 py-10">
            No {activeTab} yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
