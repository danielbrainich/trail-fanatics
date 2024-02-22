import React from 'react';

function About() {
  return (
    <div className="container mt-3 mt-md-5">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3 text-center">Trail People</h4>
              <p>Welcome to Trail People - your ultimate destination for all things trail running! The idea behind Trail People is to foster a vibrant community of trail runners, providing resources, and facilitating connections. Together, let's explore the great outdoors, embrace new challenges, and celebrate the joys of trail running!</p>
              <h6 className="mb-3">About Trail People</h6>
              <ul>
                <li>Connect and Share: Trail People is your platform to connect with fellow trail runners, share your experiences, and discover new trails. Join discussions, ask questions, and engage with like-minded individuals passionate about trail running.</li>
                <li>Discover Trails: Explore a diverse range of trails recommended by our community members. From beginner-friendly paths to challenging routes, find the perfect trail for your next adventure.</li>
                <li>Stay Updated: Stay informed about upcoming trail running events, races, and news. Get insider tips, training advice, and inspiration to fuel your passion for trail running.</li>
              </ul>
              <h6 className="mb-3">About Me</h6>
              <p>Hi there! I'm Daniel Brainich, an avid trail runner and software development. As the creator of Trail People, I'm passionate about combining my love for trail running with my growing skills in software engineering.</p>
              <h6 className="mb-3">Let's Connect</h6>
              <p>Feel free to connect with me on any way that works for you:</p>
                <ul>
                    <li><a href="https://www.linkedin.com/in/danielbrainich/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                    <li><a href="https://www.danielbrainich.com" target="_blank" rel="noopener noreferrer">Portfolio</a></li>
                    <li><a href="https://github.com/danielbrainich/trail-People" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
