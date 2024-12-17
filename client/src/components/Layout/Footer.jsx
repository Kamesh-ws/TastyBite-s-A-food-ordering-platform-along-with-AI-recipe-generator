import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className=" bg-white shadow-md text-white py-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
                
                {/* Brand and Description */}
                <div>
                    <h2 className="text-2xl font-bold text-orange-500 mb-3">TastyBites</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Bringing you delicious dishes from top-rated restaurants right to your doorstep. Discover and order from a wide range of cuisines!
                    </p>
                </div>
                
                {/* Navigation Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-orange-500">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        {/* <li><a href="/about" className="hover:text-white transition">About Us</a></li> */}
                        <li><a href="/menu" className="hover:text-white transition">Menu</a></li>
                        <li><a href="/offers" className="hover:text-white transition">Offers</a></li>
                        {/* <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li> */}
                    </ul>
                </div>
                
                {/* Contact Information */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-orange-500">Contact Us</h3>
                    <p className="text-gray-400 mb-2">123 Tasty Street, Food City</p>
                    <p className="text-gray-400 mb-2">Email: support@tastybites.com</p>
                    <p className="text-gray-400">Phone: +1 234 567 890</p>
                </div>
                
                {/* Social Media Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-orange-500">Developer</h3>
                    
                    <p className="text-gray-400 mb-2">Kameshwaran S</p>
                    <p className="text-gray-400 mb-2">skameshwaran12@gmail.com</p>
                    <p className="text-gray-400 mb-2">a Full-Stack web dev</p>
                    
                </div>
                {/* Social Media Links
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-orange-500">Follow Us</h3>
                    <div className="flex space-x-4 text-gray-400">
                        <a href="https://facebook.com" className="hover:text-white transition"><FaFacebook size={24} /></a>
                        <a href="https://instagram.com" className="hover:text-white transition"><FaInstagram size={24} /></a>
                        <a href="https://twitter.com" className="hover:text-white transition"><FaTwitter size={24} /></a>
                        <a href="https://youtube.com" className="hover:text-white transition"><FaYoutube size={24} /></a>
                    </div>
                </div> */}
            </div>
            

            {/* Copyright */}
            <div className="text-center mt-10 text-gray-500">
                <p>© {new Date().getFullYear()} TastyBites. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
