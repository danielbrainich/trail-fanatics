import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

function PostLikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);

  // useEffect(() => {
  //   const fetchLikeStatus = async () => {
  //     const response = await fetch(`http://localhost:8000/content/posts/${postId}/check-like/`, {
  //       credentials: 'include',
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setLiked(data.liked);
  //       if(data.liked) {
  //         setLikeId(data.likeId);
  //       }
  //     }
  //   };

  //   fetchLikeStatus();
  // }, [postId]);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

    const csrfToken = getCookie('csrftoken');
    console.log("CSRF Token:", csrfToken);

  const toggleLike = async () => {
    if (!liked) {
      try {
        const response = await fetch(`http://localhost:8000/content/posts/${postId}/post-likes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrfToken,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setLikeId(data.id);
          setLiked(true);
        } else {
          console.error('Failed to create like');
        }
      } catch (error) {
        console.error('Error creating like:', error);
      }
    } else {
      try {
        const response = await fetch(`http://localhost:8000/content/posts/${postId}/post-likes/${likeId}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrfToken,
          },
          credentials: 'include',
        });

        if (response.ok) {
          setLiked(false);
          setLikeId(null);
        } else {
          console.error('Failed to delete like');
        }
      } catch (error) {
        console.error('Error deleting like:', error);
      }
    }
  };


  return (
    <button className="like-button me-2" onClick={toggleLike} style={{ border: 'none', background: 'transparent'}}>
      <FontAwesomeIcon icon={liked ? farHeart : farHeart} style={{ color: liked ? '#ff69b4' : 'grey' }} size='1x' />
    </button>
  );
}

export default PostLikeButton
