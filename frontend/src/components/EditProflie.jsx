import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '@/redux/authSlice';

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || '',
    gender: user?.gender || ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const imageRef = useRef();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  const selectChangeHandler = (value) => {
    setInput((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('bio', input.bio);
      formData.append('gender', input.gender);
      if (input.profilePhoto && input.profilePhoto instanceof File) {
        formData.append('profilePhoto', input.profilePhoto);
      }

      const res = await axios.post(
        `https://instragramcopy.onrender.com/api/v1/user/profile/edit`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );

      if (res.data.success) {
        const updatedData = {
          ...user,
          bio: res.data.user.bio,
          profilePicture: res.data.user.profilePicture,
          gender: res.data.user.gender
        };
        dispatch(setAuthUser(updatedData));
        toast.success(res.data.message);
        navigate(`/profile/${user._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <section className="bg-white dark:bg-[#1f1f1f] shadow-md rounded-xl p-6 flex flex-col gap-6 border dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Profile</h1>

        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src={
                input.profilePhoto instanceof File
                  ? URL.createObjectURL(input.profilePhoto)
                  : input.profilePhoto
              }
              alt="Profile"
            />
            <AvatarFallback>YA</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-gray-800 dark:text-white">{user?.username}</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user?.bio || 'Bio here...'}
            </span>
            <input
              type="file"
              ref={imageRef}
              onChange={fileChangeHandler}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-fit text-sm mt-2"
              onClick={() => imageRef.current.click()}
            >
              Change Profile Photo
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Bio</label>
          <Textarea
            value={input.bio}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Tell us about yourself..."
            className="mt-1 dark:bg-[#2a2a2a] dark:text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1 block">
            Gender
          </label>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full max-w-xs dark:bg-[#2a2a2a] dark:text-white">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#2a2a2a] dark:text-white">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button
            className="w-full max-w-xs"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Please wait...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
