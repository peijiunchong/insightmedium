import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpCircleFill} from 'react-icons/bs'
import { urlFor, client} from '../client'
import { fetchUser } from '../utils/fetchUser';

const Pin = ({pin: {image, _id, postedBy, destination, save}}) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();

  const userInfo = fetchUser();

  const alreadySaved = (save?.filter((item) => item.postedBy._id === userInfo.googleId))?.length

  // 1 [2, 3, 1] -> [1].length -> 1 -> !1 -> false -> !false -> true
  // 4 [2, 3, 1] -> [0].length -> 0 -> !0 -> true -> !true -> false

  return (
    <div className='m-2'>
      <div 
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden translate-all duration-500 ease-in-out"
      >
        <img 
          src={urlFor(image).url()} 
          alt="user-post" 
          className='rounded-lg w-full'
        />
        {
          postHovered && (
            <div
              className='absolute top-0 h-full w-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
              style={{height: '100%'}}
            >
              <div className='flex items-center justify-between'>
                <div className='flex gap-2'>
                  <a
                    href={`${image?.asset?.url}?dl=`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  >
                    <MdDownloadForOffline />
                  </a>
                </div>
                {
                  alreadySaved
                  ? 
                    (
                      <button>
                        Saved
                      </button>
                    )
                  : 
                    (
                      <button>
                        Save
                      </button>
                    )
                }
              </div>
            </div>
          )
        }
        
      </div>
    </div>
  )
}

export default Pin