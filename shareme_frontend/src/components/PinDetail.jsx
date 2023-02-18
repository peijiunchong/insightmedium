import React, {useEffect, useState} from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'
import {MdDelete} from 'react-icons/md'


const PinDetail = ({user}) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const {pinId} = useParams();
  
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);
    
    if(query) {
      client.fetch(query)
      .then((data) => {
        setPinDetail(data[0]);

        console.log(data)
        
        if(data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          
          client.fetch(query)
          .then((res) => setPins(res))
        }
      })
    }
  }
  
  useEffect(() => {
    fetchPinDetails();
  }, [pinId])

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({comments: []})
        .insert("after", 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(()=>{
          setAddingComment(false);
          setComment('')
          fetchPinDetails();
          window.location.reload();

        })
    }
  }

  const deleteComment = (key) => {
    client
      .patch(pinId)
      .unset([`comments[ _key=="${key}" ]`])
      .commit()
      .then(() => {
        fetchPinDetails();
        window.location.reload();
      })
  }
  
  if(!pinDetail) return <Spinner message="Loading post..."/>
  
  return (
    <>
      <div className='flex xl:flex-row flex-col m-auto bg-white' style={{maxWidth: '1500px', borderRadius: '32px'}}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img 
            src={pinDetail?.image && urlFor(pinDetail?.image).url()} 
            alt="user-post" 
            className='rounded-t-2xl rounded-b-lg w-full'
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex justify-between items-center'>
            <div className='flex gap-2'>
              <a
                href={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail?.destination} target="_blank" rel='noreferrer'>
              {pinDetail?.destination.length > 15 ? pinDetail?.destination.slice(8, 15) : pinDetail?.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link to={`/user-profile/${user._id}`} className="flex items-center mt-5 gap-3 bg-white">
            <img src={pinDetail.postedBy.image} alt="user-img" className='w-10 h-10 rounded-full'/>
            <p className='font-bold'>{pinDetail.postedBy.userName}</p>
          </Link>

          {/* comments */}
          <h2 className='mt-5 text-2xl'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {
              pinDetail?.comments?.map((comment, i) => (
                <div className="flex gap-2 mt-5 items-center justify-start bg-white rounded-lg group/comment" key={i}>
                  <img
                    src={comment?.postedBy?.image}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{comment.postedBy?.userName}</p>
                    <p>{comment?.comment}</p>
                  </div>
                  {
                    comment?.postedBy?._id === user._id ? (
                      <div className='invisible group-hover/comment:visible '>
                        <MdDelete 
                          onClick={() => deleteComment(comment?._key)}
                          className='shadow-md rounded-full text-2xl m-2 cursor-pointer ml-96'
                          />    
                      </div>
                    ) : <></>
                  }
                </div>
              ))
            }
          </div>
          <div className='flex flex-wrap mt-6 gap-3 items-center'>
            <Link to={`/user-profile/${user._id}`}>
              <img src={user.image} alt="user-img" className='w-10 h-10 rounded-full cursor-pointer'/>
            </Link>
            <input type="text" name="" id="" 
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              placeholder="Comments..."
              className="flex-1 border-gray-100 border-2 rounded-2xl p-2 outline-none focus:border-gray-300"
            />
            <button 
              type='button'
              className='bg-red-500 text-white outline-none text-base rounded-full px-6 py-2 font-semibold'
              onClick={addComment}
            >
              {addingComment ? 'Adding Comment...' : 'Done'}
            </button>
          </div>
        </div>
      </div>
      {
        pins?.length > 0 && (
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
        )
      }
      {
        pins ? (
          <MasonryLayout pins={pins} />
        ) : (
          <Spinner message="Loading more pins" />
        )
      }
    </>
    )
  }

export default PinDetail