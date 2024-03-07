import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';

function About() {
  return (
    <>
      <div className="mb-3 txt-larger">Welcome to <span className="txt-logo">Trail People</span>, your destination for all things trail running! We're here to foster a vibrant community of
      trail runners and facilitate connections.
      </div>
      <div className="mb-3 txt-larger">
        Sign up and create a profile to access all our awesome features!
      </div>
        <ul className="list-unstyled">
          <li className="mb-3 txt-larger">From the <span className="txt-larger txt-yellow">social feed</span> users can connect with fellow trail runners. Users can write new posts, comment on posts, and
          <FontAwesomeIcon icon={fasHeart} className='heart-icon liked mx-2' size='1x' />content they like. Users can also create, share, and save custom maps.</li>
          <li className="mb-3 txt-larger">From the <span className="txt-larger txt-yellow">saved maps</span> page users can view all the maps they've saved in one place.</li>
          <li className="mb-4 txt-larger">From the <span className="txt-larger txt-yellow">profile</span> page users can view and update their user profile.</li>
          <li className="mb-4 txt-larger">See you on the trail!</li>
        </ul>
        <div className="mt-4">designed and created by <a href="https://www.danielbrainich.com" target="_blank" rel="noopener noreferrer">@danielbrainich</a></div>
      </>
  );
}

export default About;
