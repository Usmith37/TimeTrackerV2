import React from 'react';
import {Link} from "react-router-dom";

function NavButton({ path, label }) {
    return (
        <Link to={path}>
            <button>{label}</button>
        </Link>
    );
}

export default NavButton;