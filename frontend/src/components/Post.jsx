import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { LucideSendHorizontal, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { FiMessageCircle } from 'react-icons/fi';
import { IoBookmarksOutline } from 'react-icons/io5';
import CommentDialoge from './CommentDialoge';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';


function Post({ post }) {
  const { user } = useSelector((store) => store.auth);

  const { posts } = useSelector((store) => store.post);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false); 
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [comments, setComments] = useState(post.comments); 
  const [liked, setLiked] = useState(post.likes.includes(user?._id || false));
  const [postLike, setPostLike] = useState(post.likes.length);

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://instragramcopy.onrender.com/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts?.filter((item) => item?._id !== post?._id);
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setDialogOpen(false); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const likeOrDislikeHandler = async () => {
    const action = liked ? 'dislike' : 'like';
    try {
      const res = await axios.get(
        `https://instragramcopy.onrender.com/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p?._id === post?._id
            ? {
                ...p,
                likes: liked ? p.likes.filter(id => id !== user.id) : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://instragramcopy.onrender.com/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [res.data.comment, ...comments];
        setComments(updatedCommentData);
        setText("");
        const updatedPostData = posts.map((p) =>
          p?._id === post?._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        dispatch(setSelectedPost({ ...post, comments: updatedCommentData }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `https://instragramcopy.onrender.com/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!post) return null;

  return (
    <div className="w-full max-w-md mx-auto my-8 bg-white dark:bg-black rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 text-black dark:text-white">
      {/* Top Section */}
      <div className="flex items-center justify-between px-4 py-3">
       <div className="flex items-center gap-3">
  <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500">
    <div className="bg-black p-[2px] rounded-full">
       <Link to={`/profile/${post.author?._id}`} onClick={() => window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
})}>

      <Avatar>
        <AvatarImage
          src={post?.author?.profilePicture}
          alt="post_img"
          className="w-10 h-10"
        />
        <AvatarFallback>YA</AvatarFallback>
      </Avatar>
      </Link>
    </div>
  </div>
   <Link to={`/profile/${post.author?._id}`} onClick={() => window.scrollTo(0, 0)}>
  <h1 className="font-semibold text-sm">{post?.author?.username}</h1>
  </Link>
  {post?.author?._id === user?._id && (
    <Badge variant="secondary">Author</Badge>
  )}
</div>


        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="w-[250px] p-5 flex flex-col items-center gap-3 text-sm text-center rounded-xl">
            <Button variant="ghost" className="text-[#ED4956] font-semibold w-full text-base py-2 cursor-pointer">
              Unfollow
            </Button>
            <Button variant="ghost" className="w-full text-base py-2 cursor-pointer">
              Add to favorites
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="w-full text-base py-2 cursor-pointer"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img className="w-full h-[400px] object-cover" src={post?.image} alt="Post" />

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                size={22}
                className="cursor-pointer text-red-600"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={22}
                className="cursor-pointer hover:scale-110 transition"
              />
            )}
            <FiMessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              size={22}
              className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
            />
            <LucideSendHorizontal
              size={22}
              className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
            />
          </div>
          <IoBookmarksOutline
            size={22}
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
          />
        </div>

        <p className="font-medium text-sm mb-1">{postLike} likes</p>

        <p className="text-sm mb-1">
          <span className="font-semibold mr-1">{post?.author?.username}</span>
          {post.caption}
        </p>

        {post?.comments?.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:underline"
          >
            View all {post?.comments?.length} comments
          </span>
        )}

        <CommentDialoge open={open} setOpen={setOpen} />

        <div className="flex items-center mt-3 border-t pt-2 border-gray-300 dark:border-gray-700">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className="w-full text-sm outline-none bg-transparent text-black dark:text-white"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-sm text-blue-500 font-medium cursor-pointer"
            >
              Post
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
