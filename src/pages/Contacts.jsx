import React from 'react'
import Form from "../components/Form"
import HyperLinks from '../components/HyperLinks'

import { useSpring, animated } from 'react-spring';
import { useInView } from "react-intersection-observer";

const Contacts = () => {
  const [ ref1, inView1 ] = useInView({threshold: 0.5, triggerOnce: true});
  const [ ref2, inView2 ] = useInView({threshold: 0.5, triggerOnce: true});

  const fadeDown1 = useSpring({
    transform: inView1? "translateY(0)" : 'translateY(50%)',
    opacity: inView1? 1 : 0,
    config: {duration: 500}
  });
  const fadeDown2 = useSpring({
    transform: inView2? "translateY(0)" : 'translateY(50%)',
    opacity: inView2? 1 : 0,
    config: {duration: 500}
  });
  return (
  <>
  <animated.div ref={ref1} style={fadeDown1}>
    <Form />
  </animated.div>
  <animated.div ref={ref2} style={fadeDown2}>
    <HyperLinks />
  </animated.div>
  </>
  )
}

export default Contacts