import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Award, ShoppingCart } from 'lucide-react';
import { LOGO_URL } from '../lib/constants';
import Button from '../components/ui/Button';
import Footer from '../components/layout/Footer';
import NavBar from '../components/layout/NavBar';

const contactInfo = [
  {
    icon: <Mail size={32} className="text-amber-700 mx-auto" />,
    title: 'Email',
    details: ['info@luxehome.com'],
    description: 'We reply within 24 hours.'
  },
  {
    icon: <Phone size={32} className="text-amber-700 mx-auto" />,
    title: 'Phone',
    details: ['+013-456-7890'],
    description: 'Mon-Fri, 9am-6pm.'
  },
  {
    icon: <MapPin size={32} className="text-amber-700 mx-auto" />,
    title: 'Address',
    details: ['123 Furniture St, NY'],
    description: 'Visit our showroom.'
  },
  {
    icon: <Clock size={32} className="text-amber-700 mx-auto" />,
    title: 'Hours',
    details: ['Mon-Sat: 10am-8pm'],
    description: 'Open for visits.'
  }
];

function ContactUsPage() {
  return (
    <div>
      {/* Navbar (compact) */}
      {/* <header className="px-4 md:px-8 fixed top-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 items-center py-2">
            <div className="flex items-center">
              <img src="img/logo.png" alt="logo" className="w-10 h-10 md:w-12 md:h-12" />
            </div>
            <nav className="hidden md:flex justify-center space-x-3 text-sm">
              <Link to="/home" className="text-gray-700 hover:text-amber-700 font-medium">Home</Link>
              <Link to="/about-us" className="text-gray-700 hover:text-amber-700 font-medium">About Us</Link>
              <Link to="/products" className="text-gray-700 hover:text-amber-700 font-medium">Products</Link>
              <Link to="/contact-us" className="text-gray-700 hover:text-amber-700 font-medium">Contact Us</Link>
            </nav>
            <div className="flex items-center justify-end space-x-2">
              <Link to="/my-cart">
                <Button size="sm" className="text-xs flex items-center p-2 bg-amber-600 text-white hover:bg-amber-700" aria-label="My Cart">
                  <ShoppingCart size={16} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="text-xs px-3 py-1">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      <NavBar />

      {/* Hero Section */}
      <section
        className="relative h-[50vh] flex justify-center items-center bg-cover bg-center mt-20 md:mt-24"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="bg-black bg-opacity-50 px-8 md:px-12 py-8 md:py-12 rounded-lg text-center text-white mx-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Have questions? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-20 px-6 md:px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help you create the perfect living space. Reach out to us through any of the following channels.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map removed. Page structure fixed. */}
      <Footer />
    </div>
  );
}

export default ContactUsPage;
