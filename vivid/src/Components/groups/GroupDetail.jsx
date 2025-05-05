import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getGroupById, joinGroup, leaveGroup } from "../../services/groupService";
import GroupChat from "./GroupChat";
import GroupEditModal from "./GroupEditModal";
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
    return <div className="group-detail-loading">Loading group details...</div>;
  }
  
  if (error) {
    return <div className="group-detail-error">{error}</div>;
  }
  
  if (!group) {
    return <div className="group-not-found">Group not found</div>;
  }
  
  return (
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