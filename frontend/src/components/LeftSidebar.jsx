import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import {
  Home,
  Search,
  TrendingUp,
  MessageCircle,
  Heart,
  PlusSquare,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function LeftSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);
const { likeNotification } = useSelector((state) => state.realTimeNotification);

  const logOutHandler = async () => {
    try {
      const res = await axios.get(
        "https://instragramcopy.onrender.com/api/v1/user/logout",
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Log Out") logOutHandler();
    else if (textType === "Create") setOpen(true);
    else if (textType === "Profile") {
      navigate(`/profile/${user?._id}` ,window.scrollTo({
  top: 0,
  left: 0,
  behavior: 'smooth'
})
);
      
    } else if (textType === "Home") {
      navigate(`/`);
    }
     else if (textType === "Messages") {
      navigate(`/chat`);
    }
  };

  const sidebarItems = [
    { id: 1, icon: <Home size={24} />, text: "Home" },
    { id: 2, icon: <Search size={24} />, text: "Search" },
    { id: 3, icon: <TrendingUp size={24} />, text: "Explore" },
    { id: 4, icon: <MessageCircle size={24} />, text: "Messages" },
    { id: 5, icon: <Heart size={24} />, text: "Notifications" },
    { id: 6, icon: <PlusSquare size={24} />, text: "Create" },
    {
      id: 7,
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { id: 8, icon: <LogOut size={24} />, text: "Log Out" },
  ];

  return (
    <div className="px-6 border-r border-gray-300 dark:border-gray-700 lg:w-[250px] sm:w-[200px] w-[20%] fixed h-full top-0 left-0 z-50 flex flex-col items-start py-6 bg-white dark:bg-black transition-colors duration-300">
      {/* Logo Section */}
      <div className="mb-6 px-6">
        <img
          src="/instagram.png"
          alt="Instagram Logo"
          className="h-12 dark:invert"
        />
      </div>

      {/* Sidebar */}
      <nav className="flex flex-col w-full">
     {sidebarItems.map((item) => (
  <div
    onClick={() => sidebarHandler(item.text)}
    key={item.id}
    className="flex items-center gap-5 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer rounded-lg px-6 py-4 w-full transition-all text-black dark:text-white"
  >
    {item.text === "Notifications" ? (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer relative">
            {/* Icon with badge */}
            <div className="relative">
              <Heart size={24} />
              {likeNotification.length > 0 && (
                <span className="absolute -top-2 -right-2 rounded-full h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center">
                  {likeNotification.length}
                </span>
              )}
            </div>
            {/* Text */}
            <span className="text-base font-medium">{item.text}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            {likeNotification.map((notification) => (
              <div key={notification.userId} className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={notification.userDetails?.profilePicture} />
                  <AvatarFallback>
                    {notification.userDetails?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm">
                  <span className="font-semibold">{notification.userDetails?.username}</span> liked your post
                </p>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    ) : (
      <>
        {item.icon}
        <span className="text-base font-medium">{item.text}</span>
      </>
    )}
  </div>
))}

      </nav>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftSidebar;
