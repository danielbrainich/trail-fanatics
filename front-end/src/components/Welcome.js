import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import sunglasses from '../assets/avatars/sunglasses.png';
import dog from '../assets/avatars/dog.png';
import mountains from '../assets/avatars/mountains.png';
import map from '../assets/avatars/map.png';
import bottle from '../assets/avatars/bottle.png';
import shoe from '../assets/avatars/shoe.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';


function Welcome () {
  const { user, fetchCurrentUser } = useAuthContext();
  const avatarOptions = {
    sunglasses,
    dog,
    mountains,
    map,
    bottle,
    shoe,
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);


    return (
      <div className="container d-flex justify-content-center mt-3 mt-md-5 vh-100">
        <div className="row flex-fill d-flex justify-content-center">
          <div className="col-lg-8">
            <div className="card">
                <div className="card-body p-5">
                {user && (
                  <div className="mb-3 txt-larger txt-yellow">Hey {user.username}!</div>
                  )}
                  <div className="mb-3 txt-larger">Welcome to <span className="txt-logo">Trail People</span>, your destination for all things trail running! We're here to foster a vibrant community of
                  trail runners and facilitate connections.
                  </div>
                    <ul className="list-unstyled">
                      <li className="mb-3 txt-larger">From your <span className="txt-larger txt-yellow">social feed</span> you can connect with fellow trail runners. Write new posts, comment on posts, and
                      <FontAwesomeIcon icon={fasHeart} className='heart-icon liked mx-2' size='1x' />content you like. You can also create, share, and save custom maps.</li>
                      <li className="mb-3 txt-larger">From your <span className="txt-larger txt-yellow">saved maps</span> page (in the user dropdown menu) you can view all the maps you've saved in one place.</li>
                      <li className="mb-4 txt-larger">From your <span className="txt-larger txt-yellow">profile</span> page (also in the user dropdown menu) you can view and update your user profile.</li>
                      <li className="mb-4 txt-larger">Click on the <span className="txt-logo txt-larger txt-yellow">Trail People</span> logo any time to go back home to your <span className="txt-larger txt-yellow">social feed</span>.</li>
                    </ul>
                    <Link to="/" className="txt-larger btn btn-primary mb-5">
                      Got it! Let's go!
                    </Link>
              </div>
            </div>
            <div className="mt-2">designed and created by <a href="https://www.danielbrainich.com" target="_blank" rel="noopener noreferrer">@danielbrainich</a></div>
          </div>
        </div>
      </div>
    );

  }

export default Welcome;
