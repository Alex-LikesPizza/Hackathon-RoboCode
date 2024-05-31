import React from 'react'
import { useSpring, animated } from 'react-spring';
import { useInView } from "react-intersection-observer";

const Home = () => {
  const [refLeft1, inViewLeft1] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [refLeft2, inViewLeft2] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [refRight1, inViewRight1] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [refRight2, inViewRight2] = useInView({ triggerOnce: true, threshold: 0.5 });

  const fadeToLeft1 = useSpring({
    opacity: inViewLeft1 ? 1 : 0,
    transform: inViewLeft1 ? 'translateX(0)' : 'translateX(50%)',
    config: { duration: 500 },
  });

  const fadeToLeft2 = useSpring({
    opacity: inViewLeft2 ? 1 : 0,
    transform: inViewLeft2 ? 'translateX(0)' : 'translateX(50%)',
    config: { duration: 500 },
  });
  const fadeToRight1 = useSpring({
    opacity: inViewRight1 ? 1 : 0,
    transform: inViewRight1 ? 'translateX(0)' : 'translateX(-50%)',
    config: { duration: 500 },
  });

  const fadeToRight2 = useSpring({
    opacity: inViewRight2 ? 1 : 0,
    transform: inViewRight2 ? 'translateX(0)' : 'translateX(-50%)',
    config: { duration: 500 },
  });

  return (
    <section  className="home">
      <animated.div ref={refLeft1} style={fadeToLeft1} className="home__section" >
        <div className='home__info'>
          <h1 className="home__title">Path<span>Finder</span></h1>
          <p className='home__text'>
            Welcome to PathFinder, a game to start you off in your programming career. This is a guide for 
            absolute beginners in programming, as well as a game of logic. The game will you about the absolute basics of
            programming, like boolean algebra, code execution flow and many more. After finishing this course,
            try your hand at one of the more advanced programming languages, like JavaScript, Python or even
            Lua and C# if you're into game development.I've spent a good chunk of time on this game, so I hope 
            you will like it.
          </p>
        </div>
        <img className='home__image' src="./src/images/character.jpg" alt="main character" />
      </animated.div>
      <animated.div ref={refRight1} style={fadeToRight1} className="home__section home__section--reverse">
        <div className="home__info">
          <h2 className="home__subtitle">
            <span>About</span> this project
          </h2>
          <p className='home__text'>
            This project was made for the Robocode Web Development competition from 1st June, 2024. The
            competition had 3 themes: Virtual Museum, Environmental Awareness Campaign, and Codding Game
            Adventures. I chose the Coding Game Adventures theme because it is the most fun one, and because
            I can show off my raw coding skills.
          </p>
        </div>
        <img className='home__image' src="./src/images/trophy.jpg" alt="" />
      </animated.div>
      <animated.div ref={refLeft2} style={fadeToLeft2} className="home__section">
        <div className="home__info">
          <h2 className="home__subtitle">
            About <span>Me</span>
          </h2>
          <p className='home__text'>
            Hi again. Allow me to formally introduce myself. My name is Alexandru and I enjoy learning.
            Not just Web Development, I enjoy learning maths, foreign languages, music and other skills that may
            or may not help me in the future. My skillset is rich, from HTML/CSS/JS to React, SCSS, Firebase 
            and C++. I like to participate in competitions and to win them, because for now, that's all I can do.
          </p>
        </div>
        <img className='home__image' src="./src/images/me.jpg" alt="" />
      </animated.div>
      <animated.div ref={refRight2} style={fadeToRight2} className="home__section home__section--reverse"> 
        <div className="home__info">
          <h2 className="home__subtitle">
            About <span>You</span>?
          </h2>
          <p className='home__text'>
            If you stumbled upon this page, then you're probably interested in programming. Here is some advice
            for you. First up, don't fall into "tutorial h#ll". This term refers to when you
            watch tutorial after tutorial, never applying what you have learned. Next, use a platform like github
            to display your progress. If you do daily pushes to github, it really helps you to stand
            out in a job interview. That should be your main motivation. That's all. Enjoy the game!
          </p>
        </div>
        <img className='home__image' src="./src/images/help.jpg" alt="" />
      </animated.div>
    </section>
  )
}

export default Home