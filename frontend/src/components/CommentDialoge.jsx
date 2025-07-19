import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';
import axios from 'axios';

function CommentDialoge({ open, setOpen }) {
  const [text, setText] = useState('');
  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [comment, setComment] = useState(selectedPost?.comments);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://instragramcopy.onrender.com/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        setText('');

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="w-[90vw] md:w-[60vw] h-[500px] p-0 overflow-hidden rounded-xl bg-white dark:bg-[#1a1a1a] text-black dark:text-white flex"
      >
        {/* Image Section */}
        <div className="w-1/2 h-full hidden md:block bg-black">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgm_1CTOtPqJkQhjJoTgViC2W7Q2LdbNNEYg&s"
            alt="post"
            className="w-full h-full object-cover"
          />
        </div>

      
        <div className="w-full md:w-1/2 h-full flex flex-col justify-between">
        
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedPost?.author?.profilePicture} />
                <AvatarFallback>YA</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">{selectedPost?.author?.username}</span>
            </div>
            <MoreHorizontal className="cursor-pointer text-gray-600 dark:text-gray-300" />
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm bg-white dark:bg-[#1a1a1a]">
            {comment?.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start gap-3 p-2 rounded-md transition"
              >
               
                <img
                  src={comment?.author?.profilePicture}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />

                {/* Comment content */}
                <div className="flex-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-semibold">{comment?.author?.username}</span>
                    <span className="ml-1">{comment?.text}</span>
                  </div>

                  <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{comment?.timeAgo || '21h'}</span>
                    <span>{comment?.likes || '9'} likes</span>
                    <span className="cursor-pointer hover:underline">Reply</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a]">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <input
              value={text}
              onChange={changeEventHandler}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-full bg-gray-100 dark:bg-[#2a2a2a] text-sm outline-none text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <button
              onClick={commentHandler}
              className="text-sm text-blue-500 font-semibold disabled:opacity-50"
              disabled={!text}
            >
              Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialoge;
