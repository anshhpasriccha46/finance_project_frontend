import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import "./Sidebar.css";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggleSidebar = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  render() {
    return (
      <div className={`Sidebar ${this.state.isOpen ? "open" : ""}`}>
       <button className="toggle-btn" onClick={this.toggleSidebar}>
        <FontAwesomeIcon icon={faBars} />
        </button>


        {this.state.isOpen && (
          <ul className="menu">
            <li>Dashboard</li>
            <li>Portfolio</li>
            <li>Transactions</li>
            <li>Analytics</li>
          </ul>
        )}
      </div>
    );
  }
}

export default Sidebar;
