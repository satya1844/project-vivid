import React from "react";
import { Link } from "react-router-dom";
import GroupList from "../../src/Components/groups/GroupList";
import "./GroupsPage.css";

const GroupsPage = () => {
  return (
    <div className="groups-page-container">
      <div className="groups-header">
        <h1>Communities</h1>
        <Link to="/groups/create" className="create-group-button">
          Create Group
        </Link>
      </div>
      
      <GroupList />
    </div>
  );
};

export default GroupsPage;