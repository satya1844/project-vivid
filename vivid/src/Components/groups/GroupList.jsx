import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPublicGroups, getUserGroups } from "../../services/groupService";
import { Link } from "react-router-dom";
import "./GroupList.css";
import Loader from "../../assets/Loader";

const GroupList = () => {
  const { currentUser } = useAuth();
  const [userGroups, setUserGroups] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("myGroups");

  useEffect(() => {
    const fetchGroups = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Fetch groups where user is a member
        const myGroups = await getUserGroups(currentUser.uid);
        setUserGroups(myGroups);
        
        // Fetch public groups
        const allPublicGroups = await getPublicGroups();
        // Filter out groups user is already a member of
        const filteredPublicGroups = allPublicGroups.filter(
          group => !group.members.includes(currentUser.uid)
        );
        setPublicGroups(filteredPublicGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [currentUser]);

  return (
    <div className="group-list-container">
      <div className="group-tabs">
        <button
          className={`tab ${activeTab === "myGroups" ? "active" : ""}`}
          onClick={() => setActiveTab("myGroups")}
        >
          My Groups
        </button>
        <button
          className={`tab ${activeTab === "discover" ? "active" : ""}`}
          onClick={() => setActiveTab("discover")}
        >
          Discover
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <Loader size="50" speed="1.75" color="yellow" />
        </div>
      ) : activeTab === "myGroups" ? (
        <div className="groups">
          {userGroups.length > 0 ? (
            userGroups.map(group => (
              <Link 
                to={`/groups/${group.id}`} 
                key={group.id} 
                className="group-item"
              >
                <div className="group-avatar">
                  {group.groupPic ? (
                    <img src={group.groupPic} alt={group.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {group.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="group-details">
                  <h3 className="group-name">{group.name}</h3>
                  <p className="group-bio">{group.bio}</p>
                  <div className="group-meta">
                    <span className="members-count">
                      {group.members.length} members
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-groups">
              <p>You haven't joined any groups yet.</p>
              <p className="hint">Discover and join communities that interest you!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="groups">
          {publicGroups.length > 0 ? (
            publicGroups.map(group => (
              <Link 
                to={`/groups/${group.id}`} 
                key={group.id} 
                className="group-item"
              >
                <div className="group-avatar">
                  {group.groupPic ? (
                    <img src={group.groupPic} alt={group.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {group.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="group-details">
                  <h3 className="group-name">{group.name}</h3>
                  <p className="group-bio">{group.bio}</p>
                  <div className="group-meta">
                    <span className="members-count">
                      {group.members.length} members
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-groups">
              <p>No public groups available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupList;