import { setSuggestedUsers } from "@/redux/authSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "https://instragramcopy.onrender.com/api/v1/user/suggested",
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        toast.error(error.response?.data?.message );
      }
    };

    fetchSuggestedUsers();
  }, []); 
};

export default useGetSuggestedUsers;
