import React from 'react';

const Nav = function(props) {
  return (
    <nav>
      {props.navBtns.map(btn => {
        return <button>{btn}</button>;
      })}
    </nav>
  );
};

export default Nav;
