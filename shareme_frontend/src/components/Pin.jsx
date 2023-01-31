import React from 'react'
import { urlFor } from '../client'

const Pin = ({pin}) => {
  console.log(pin);
  return (
    <div>
      <img 
        src={urlFor(pin?.image).url()} 
        alt="user-post" 
        className='rounded-lg w-full'
      />
    </div>
  )
}

export default Pin