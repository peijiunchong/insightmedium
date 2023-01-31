import React from 'react'
import GoogleLogin from 'react-google-login'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { useEffect } from 'react'
import { gapi } from 'gapi-script';

import {client} from '../client'

const Login = () => {

  const navigate = useNavigate();

  // loads Google API scripts and initializes some functions
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
        scope: 'email',
      });
    }
      gapi.load('client:auth2', start);
  }, [])

  const onSuccess = response => {
    localStorage.setItem('user', JSON.stringify(response.profileObj))

    const {name, googleId, imageUrl} = response.profileObj;

    // create new sanity document
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl
    }

    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', {replace: true})
      })
  };
  const onFailure = response => {
    console.log('FAILED', response);
  };
  
  return (
    <div className='flex justify-center items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video 
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width="130px" alt="logo" />
          </div>

          <div className='shadow-2xl'>
            <GoogleLogin 
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type='button'
                  className='bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none'
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4"/> Sign in with Google
                </button>
              )}
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={'single_host_origin'}
              // isSignedIn={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login