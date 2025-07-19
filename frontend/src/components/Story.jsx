import React, { useState, useEffect } from 'react'

const stories = [
  { username: 'yash_09', img: 'https://res.cloudinary.com/dp41h4ize/image/upload/v1738528763/qhukch3z18ppfkwhvsms.jpg' },
  { username: 'arbab_89', img: 'https://res.cloudinary.com/dp41h4ize/image/upload/v1738524129/w8n2ett8f8rodmh5co5w.jpg' },
  { username: 'aniket', img: 'https://res.cloudinary.com/dp41h4ize/image/upload/v1738520658/wfu5klgzhsy2dgnjnurc.jpg' },
  { username: 'vishal', img: 'https://res.cloudinary.com/dp41h4ize/image/upload/v1738525433/gmb0ttcfagmqixb6gogo.jpg' },
  { username: 'aditya', img: 'https://res.cloudinary.com/dp41h4ize/image/upload/v1738526636/lbaexauevqqaxwbnhmmo.jpg' },
  { username: 'ritik', img: 'https://res.cloudinary.com/dp41h4ize/image/upload/v1738523042/dc7mcdoyxno2wvvbomqy.jpg' },
]

const Story = () => {
  const [selectedStory, setSelectedStory] = useState(null)

  useEffect(() => {
    let timer
    if (selectedStory) {
      timer = setTimeout(() => {
        setSelectedStory(null)
      }, 10000) 
    }
    return () => clearTimeout(timer)
  }, [selectedStory])

  return (
    <>
      <div className="flex gap-4 overflow-x-auto ml-100 p-4">
        {stories.map((story, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-white text-sm cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] rounded-full">
              <div className="bg-black p-[2px] rounded-full">
                <img
                  src={story.img}
                  alt={story.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            </div>
            <span className="mt-1 w-16 text-center truncate">{story.username}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer Full Screen */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <img
            src={selectedStory.img}
            alt={selectedStory.username}
            className="max-w-[90%] max-h-[90%] rounded-lg"
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setSelectedStory(null)}
          >
            ×
          </button>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedStory.username}
          </div>

          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
            <div className="h-full bg-white animate-storyProgress"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default Story
