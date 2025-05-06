import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getGroupById, joinGroup, leaveGroup, getUserGroups } from "../../services/groupService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/authConfig";
import GroupChat from "./GroupChat";
import GroupEditModal from "./GroupEditModal";
import Loader from "../../assets/Loader"; // Add this import
import "./GroupDetail.css";

const GroupDetail = () => {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  
  // Fetch group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) return;
      
      try {
        setLoading(true);
        const groupData = await getGroupById(groupId);
        
        if (!groupData) {
          setError("Group not found");
          return;
        }
        
        setGroup(groupData);
        setIsMember(groupData.members.includes(currentUser?.uid));
        setIsAdmin(groupData.admin === currentUser?.uid);
      } catch (error) {
        console.error("Error fetching group details:", error);
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupDetails();
  }, [groupId, currentUser]);
  
  // Fetch user's groups for the sidebar
  useEffect(() => {
    const fetchUserGroups = async () => {
      if (!currentUser) return;
      
      try {
        const groups = await getUserGroups(currentUser.uid);
        setUserGroups(groups);
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };
    
    fetchUserGroups();
  }, [currentUser]);
  
  // Fetch group members
  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!group || !group.members || group.members.length === 0) return;
      
      try {
        setLoadingMembers(true);
        const memberProfiles = [];
        
        for (const memberId of group.members) {
          const userDoc = doc(db, "users", memberId);
          const userSnapshot = await getDoc(userDoc);
          
          if (userSnapshot.exists()) {
            memberProfiles.push({
              id: memberId,
              name: `${userSnapshot.data().firstName || ''} ${userSnapshot.data().lastName || ''}`.trim() || 'Anonymous',
              photoURL: userSnapshot.data().photoURL || null,
              isAdmin: memberId === group.admin
            });
          }
        }
        
        setGroupMembers(memberProfiles);
      } catch (error) {
        console.error("Error fetching group members:", error);
      } finally {
        setLoadingMembers(false);
      }
    };
    
    fetchGroupMembers();
  }, [group]);
  
  const handleJoinGroup = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    try {
      const result = await joinGroup(groupId, currentUser.uid);
      if (result.success) {
        setIsMember(true);
        // Update the group object to include the current user
        setGroup(prev => ({
          ...prev,
          members: [...prev.members, currentUser.uid]
        }));
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };
  
  const handleLeaveGroup = async () => {
    try {
      const result = await leaveGroup(groupId, currentUser.uid);
      if (result.success) {
        setIsMember(false);
        // Update the group object to remove the current user
        setGroup(prev => ({
          ...prev,
          members: prev.members.filter(id => id !== currentUser.uid)
        }));
      }
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleGroupUpdate = (updatedGroup) => {
    setGroup(updatedGroup);
  };
  
  if (loading) {
    return (
      <div className="group-detail-loading">
        <Loader size="100" speed="1.75" color="yellow" />
      </div>
    );
  }
  
  if (error) {
    return <div className="group-detail-error">{error}</div>;
  }
  
  if (!group) {
    return <div className="group-not-found">Group not found</div>;
  }
  
  return (
    <div className="group-detail-page">
      {/* Left Sidebar - Groups List */}
      <div className="groups-sidebar">
        <h3>My Communities</h3>
        <div className="sidebar-groups-list">
          {userGroups.length > 0 ? (
            userGroups.map(userGroup => (
              <Link 
                to={`/groups/${userGroup.id}`} 
                key={userGroup.id} 
                className={`sidebar-group-item ${userGroup.id === groupId ? 'active' : ''}`}
              >
                <div className="sidebar-group-avatar">
                  {userGroup.groupPic ? (
                    <img src={userGroup.groupPic} alt={userGroup.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {userGroup.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="sidebar-group-name">{userGroup.name}</div>
              </Link>
            ))
          ) : (
            <p className="no-groups-message">You haven't joined any groups yet.</p>
          )}
        </div>
      </div>
      
      {/* Main Content - Group Details */}
      <div className="group-detail-container">
        <div className="group-header">
          <div className="group-image-container">
            {group.groupPic ? (
              <img src={group.groupPic} alt={group.name} className="group-image" />
            ) : (
              <div className="group-image-placeholder">
                {group.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="group-info">
            <h1 className="group-name">{group.name}</h1>
            <p className="group-bio">{group.bio}</p>
            <div className="group-meta">
              <span className="group-type">{group.type}</span>
              <span className="group-members">{group.members.length} members</span>
              <span className="group-created">Created {new Date(group.createdAt.toDate()).toLocaleDateString()}</span>
            </div>
            
            <div className="group-actions">
              {isAdmin ? (
                <button 
                  className="edit-group-button" 
                  onClick={handleOpenEditModal}
                >
                  Edit Group
                </button>
              ) : isMember ? (
                <button 
                  className="leave-group-button" 
                  onClick={handleLeaveGroup}
                >
                  Leave Group
                </button>
              ) : (
                <button 
                  className="join-group-button" 
                  onClick={handleJoinGroup}
                >
                  Join Group
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="group-content">
          <div className="group-rules">
            <h3>Group Rules</h3>
            <p>{group.rules}</p>
          </div>
          
          {isMember && (
            <div className="group-chat-section">
              <h3>Group Chat</h3>
              <GroupChat groupId={groupId} />
            </div>
          )}
        </div>
      </div>
      
      {/* Right Sidebar - Members List */}
      <div className="members-sidebar">
        <h3>Members ({group.members.length})</h3>
        <div className="members-list">
          {loadingMembers ? (
            <div className="loading-members-container">
              <Loader size="50" speed="1.75" color="yellow" />
            </div>
          ) : groupMembers.length > 0 ? (
            groupMembers.map(member => (
              <Link 
                to={`/userprofile/${member.id}`} 
                key={member.id} 
                className="member-item"
              >
                <div className="member-avatar">
                  {member.photoURL ? (
                    <img src={member.photoURL} alt={member.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="member-info">
                  <div className="member-name">{member.name}</div>
                  {member.isAdmin && <div className="admin-badge">Admin</div>}
                </div>
              </Link>
            ))
          ) : (
            <p className="no-members-message">No members found.</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <GroupEditModal 
          group={group} 
          onClose={handleCloseEditModal} 
          onUpdate={handleGroupUpdate} 
        />
      )}
    </div>
  );
};

export default GroupDetail;