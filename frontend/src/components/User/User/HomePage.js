import React from 'react';
import Header from '../../Common/Header';
import Footer from '../../Common/Footer';
import './HomePage.css';

const HomePage = () => (
  <div className="home-bg">
    <Header />
    <main className="home-main">
      <h1>Welcome to Helpdesk Management System</h1>
      <p>
        Manage your books, orders, and support tickets efficiently.<br />
        Use the navigation above to get started.
      </p>
    </main>
    <Footer />
  </div>
);

export default HomePage;