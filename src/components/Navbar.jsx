import classNames from "classnames";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import menus from "../menus";
import Logo from "./Logo";

function Menus({ items = [], activeKey }) {
  return (
    <ul className="menu menu-horizontal px-0">
      {items.map((item) => (
        <li
          key={item.key}
          className={classNames({ bordered: activeKey === item.key })}
        >
          <Link to={item.href}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  const location = useLocation();
  const activeKey = useMemo(() => {
    return menus.find((menu) => menu.href === location.pathname)?.key;
  }, [menus, location.pathname]);

  return (
    <nav className="navbar bg-base-100 h-12">
      <div className="h-full">
        <Logo />
      </div>
      <div className="navbar-center flex">
        <Menus items={menus} activeKey={activeKey} />
      </div>
      <div className="navbar-end"></div>
    </nav>
  );
}
