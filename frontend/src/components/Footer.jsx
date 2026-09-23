
import React from "react";
import { NavLink } from "react-router-dom";


import {
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* College Information */}
        <div className="footer-section">
          <h2>E-SHOP</h2>

          <p>
            Welcome to  Online markting.
           
          </p>
        </div>


        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <NavLink to="/">
            Home
          </NavLink>

          <NavLink to="/login">
            Login
          </NavLink>

          <NavLink to="/register">
            Register
          </NavLink>
        </div>


        {/*marke  Services */}
        <div className="footer-section">
          <h3>buy and sell Services</h3>

          <p>Online buy </p>
        
        </div>


        {/* Social Media */}
        <div className="footer-section">
          <h3>Connect With Us</h3>

          <div className="footer-social">

            <a
              href="https://linkedin.com/in/yourlinkedin"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://youtube.com/@youryoutube"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>

            <a
              href="https://t.me/yourusername"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
            >
              <FaTelegram />
            </a>

            <a
              href="https://instagram.com/yourinstagram"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://facebook.com/yourfacebook"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>

          </div>
        </div>

      </div>


      {/* Copyright */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} E_shop.
          All rights reserved.
        </p>

        <p>
          Online marking  System
        </p>

      </div>

    </footer>
  );
}

export default Footer;

