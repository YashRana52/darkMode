import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetAllPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(
          "https://instragramcopy.onrender.com/api/v1/post/all",
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    };

    fetchAllPost();
  }, []); 
};

export default useGetAllPosts;
