import React from 'react';

function About() {
  return (
    <div className="container mt-3 mt-md-5">
      <div className="row">
        <div className="col">
          <div className="card borderless-card">
            <div className="card-body">
              <h1 className="mb-3 text-center">Trail People</h1>
              <p>Welcome to Trail People - your ultimate destination for all things trail running! The idea behind Trail People is to foster a vibrant community of trail runners, providing resources, and facilitating connections. Together, let's explore the great outdoors, embrace new challenges, and celebrate the joys of trail running!</p>
              <h6 className="mb-2 fw-bold">About Trail People</h6>
              <ul className="list-unstyled">
                <li className="mb-2"><span className="text-decoration-underline">Connect and Share</span> Trail People is your platform to connect with fellow trail runners, share your experiences, and discover new trails. Join discussions, ask questions, and engage with like-minded individuals passionate about trail running.</li>
                <li className="mb-2"><span className="text-decoration-underline">Discover Trails</span> Explore a range of trails recommended by our community members. From beginner-friendly paths to challenging routes, find the perfect trail for your next adventure.</li>
                <li className="mb-2"><span className="text-decoration-underline">Stay Updated</span> Stay informed about upcoming trail running events, races, and news. Get insider tips, training advice, and inspiration to fuel your passion for trail running.</li>
              </ul>
              <h6 className="mb-2 fw-bold">About Me</h6>
              <p>Hi there, I'm <a href="https://www.danielbrainich.com" target="_blank" rel="noopener noreferrer">@danielbrainich</a>. As the creator of Trail People, I'm excited to combine my love for trail running with my growing skills in software engineering.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
