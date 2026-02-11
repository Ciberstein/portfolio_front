import React from 'react';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';

const Landing = ({ className }) => {

  const location = useLocation().pathname;
  
  const active = (path, paths = []) => {
    const allPaths = [path, ...paths];

    if (allPaths.includes(location)) {
      return "border border-b-0";
    }

    return "border-b";
  };

  const menu = [
   { name: 'Home', link: '/' },
   { name: 'Customers', link: '/customers' },
   // { name: 'Contact', link: '/contact' },
  ];

  return (
    <nav className={clsx("flex", className)}>
      {menu.map((item) => (
        <Link key={item.name} to={item.link}
          className={clsx(
            "px-4 py-1",
            "border-light-primary-500 dark:border-dark-primary-500",
            "text-light-primary-500 dark:text-dark-primary-500",
            active(item.link),
          )}>
          {item.name}
        </Link>
      ))}
      <div className={clsx("grow border-b",
        "border-light-primary-500 dark:border-dark-primary-500"
      )} />
    </nav>
  )
}

const Navbar = { Landing }

export default Navbar;
