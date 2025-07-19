import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPosts from '@/hooks/userGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUser'
import Story from './Story'

function Home() {
  useGetAllPosts()
  useGetSuggestedUsers()
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Story />
        <Feed/>
        <Outlet/>

      </div>
    
 <RightSidebar />
      
     



    </div>
  )
}

export default Home