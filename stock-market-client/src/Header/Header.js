import "./Header.css";
import {Link} from "react-router-dom";
import React from "react";


function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/stockmarket">Биржа</Link>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/brokers">Брокеры</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/stocks">Акции</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Header;
