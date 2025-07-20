import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import axios from 'axios'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { readFileAsDataURL } from '@/lib/utils'
import { Button } from './ui/button'
import { Loader2, Upload } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'

function CreatePost({ open, setOpen }) {
  const {user} = useSelector(store=>store.auth)
  const {posts} = useSelector(store=>store.post)
  const dispatch = useDispatch()

  const imageRef = useRef()
  const [file, setFile] = useState("")
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUri = await readFileAsDataURL(file)
      setImagePreview(dataUri)
    }
  }

  const createPostHandler = async () => {
    const formData = new FormData()
    formData.append("caption", caption)
    if (imagePreview) formData.append("image", file)

    try {
      setLoading(true)
      const res = await axios.post(
        "https://instragramcopy.onrender.com/api/v1/post/addpost",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      )
      if (res.data.success) {
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message)
        setOpen(false)
        setCaption("")
        setImagePreview("")
        setFile("")
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Post not created")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="sm:max-w-md w-full max-w-[95%] p-5 rounded-xl"
      >
        <DialogHeader className="font-bold text-center text-lg mb-4">
          Create New Post
        </DialogHeader>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>YN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-gray-600 text-xs">{user?.bio}</span>
          </div>
        </div>

        {/* Caption */}
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border rounded-md"
          placeholder="Write a caption..."
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full h-64 mt-4 overflow-hidden rounded-lg border">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* File Input */}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
  variant="outline"
  onClick={() => imageRef.current.click()}
  className="mt-4 w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100 transition-all text-sm font-medium"
>
  <Upload className="w-4 h-4" />
  Select from computer
</Button>

        {/* Post Button */}
        {imagePreview && (
          <div className="mt-4">
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button onClick={createPostHandler} className="w-full">
                Post
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
