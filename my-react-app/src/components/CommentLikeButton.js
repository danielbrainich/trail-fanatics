import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import useCsrfToken from '../hooks/useCsrfToken';

function CommentLikeButton({ postId }) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const response = await fetch(`http://localhost:8000/content/posts/${postId}/check-like/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        if (data.liked) {
          setLikeId(data.likeId);
        }
      }
    };

    fetchLikeStatus();
  }, [postId]);

  useEffect(() => {
    const fetchLikeCount = async () => {
      const response = await fetch(`http://localhost:8000/content/posts/${postId}/`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        setLikeCount(data.likeCount);
      }
    };

    fetchLikeCount();
  }, [postId, liked]);

  const csrfToken = useCsrfToken();

  const toggleLike = async () => {
    if (!liked) {
      try {
        console.log(csrfToken);
        const response = await fetch(`http://localhost:8000/content/posts/${postId}/post-likes/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": csrfToken.csrfToken,
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
        if (likeId) {
          const response = await fetch(`http://localhost:8000/content/posts/${postId}/post-likes/${likeId}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              "X-CSRFToken": csrfToken.csrfToken,
            },
            credentials: 'include',
          });

          if (response.ok) {
            setLiked(false);
            setLikeId(null);
          } else {
            console.error('Failed to delete like');
          }
        }
      } catch (error) {
        console.error('Error deleting like:', error);
      }
    }
  };

  return (
    <button className="like-button me-2" onClick={toggleLike} style={{ border: 'none', background: 'transparent' }}>
      <FontAwesomeIcon icon={liked ? fasHeart : farHeart} style={{ color: liked ? '#ff69b4' : 'grey' }} size='1x' />
      <span className="ms-2">{likeCount}</span>
    </button>
  );
}

export default CommentLikeButton;
