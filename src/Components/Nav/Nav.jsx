import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { navLinks, navRight } from "../../Data/Data";
import { VscMenu } from "react-icons/vsc";
import { GrClose } from "react-icons/gr";
export default function Footer() {
  return (
    <nav>
      <div className="container nav-container">
        {
          <Link to="/" className="logo">
            <img src={Logo} alt="Logo" />
          </Link>
        }
        <ul className="nav-links">
          {navLinks.map(({ name, path }, index) => {
            return (
              <li key={index}>
                <NavLink to={path}>{name}</NavLink>
              </li>
            );
          })}
        </ul>
        <div className="nav-right">
          {navRight.managements.map((item, index) => (
            <Link key={index} target="_blank" className="management-icons">
              <item.icon />
            </Link>
          ))}
          <button className="menu-button btn btn-border">
            <VscMenu className="menu-icon" />
            <GrClose className="close-icon" />
          </button>
        </div>
      </div>
    </nav>
  );
}
