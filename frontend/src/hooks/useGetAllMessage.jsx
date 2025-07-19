
import { setMessages } from "@/redux/chatSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const {selectedUser} = useSelector(store=>store.auth)

  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const res = await axios.get(
          `https://instragramcopy.onrender.com/api/v1/message/all/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        toast.error(error.response?.data?.message );
      }
    };

   fetchAllMessage();
  }, [selectedUser]); 
};

export default useGetAllMessage;
