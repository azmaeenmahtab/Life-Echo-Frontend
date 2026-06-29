import React from 'react'
import Carousel from '../Hero/Carousel'
import WhyItMatters from './WhyItMatterSection'
import Featured from './Featured'
import CommunityShowcase from './CommunityShowcase'

const HomeIndex = () => {
  return (
    <div>
      <Carousel />
      <WhyItMatters />
      <Featured />
      <CommunityShowcase />
    </div>
  )
}

export default HomeIndex
