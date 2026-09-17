import React from 'react';
import Hero from './home-sections/Hero';
import AboutStrip from './home-sections/AboutStrip';
import MenuPreview from './home-sections/MenuPreview';
import ReserveStrip from './home-sections/ReserveStrip';
import GalleryStrip from './home-sections/GalleryStrip';
import BlogStrip from './home-sections/BlogStrip';
import CareersTeaser from './home-sections/CareersTeaser';
import Testimonials from './home-sections/Testimonials';

const Home = () => {
    return (
        <div className="w-full">
            <Hero />
            <AboutStrip />
            <MenuPreview />
            <ReserveStrip />
            <BlogStrip />
            <GalleryStrip />
            <CareersTeaser />
            <Testimonials />
        </div>
    );
};

export default Home;
