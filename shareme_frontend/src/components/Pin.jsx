import React from 'react'
import { urlFor } from '../client'

const Pin = ({pin}) => {
  console.log(pin);
  return (
    <div>
      {/* <img 
        src={urlFor(pin?.image).width(100).url()} 
        alt="user-post" 
        className='rounded-lg w-full'
      /> */}
    </div>
  )
}

export default Pin