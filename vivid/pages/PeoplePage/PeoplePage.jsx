import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/config/authConfig';
import { useNavigate } from 'react-router-dom';
import placeholderProfilePic from '../../src/assets/ProfilePic.png';
import Loader from '../../src/assets/Loader';
import './PeoplePage.css';

const PeoplePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInterests, setFilterInterests] = useState([]);
  const gridRef = useRef(null);
  const navigate = useNavigate();

  // Fixed search function to properly handle case-insensitive search
  const filteredUsers = users.filter(user => {
    // Create full name from first and last name, handling null/undefined values
    const firstName = (user.firstName || '').toLowerCase();
    const lastName = (user.lastName || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Check if search term is included in the full name
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm === '' || 
                        fullName.includes(searchLower) || 
                        firstName.includes(searchLower) || 
                        lastName.includes(searchLower);
    
    // If no interest filters are selected, show all users that match the search
    if (filterInterests.length === 0) return searchMatch;
    
    // Otherwise, check if user has any of the selected interests
    const userInterests = user.interests || [];
    return searchMatch && filterInterests.some(interest => 
      userInterests.includes(interest)
    );
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "users"));
        const userData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Resize grid items after images load
  useEffect(() => {
    if (!loading && gridRef.current) {
      // Wait for images to load
      const resizeGridItems = () => {
        const grid = gridRef.current;
        const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        
        const items = grid.querySelectorAll('.masonry-item');
        items.forEach(item => {
          // Don't override the nth-child rules
          if (!item.style.gridRowEnd) {
            const content = item.querySelector('.person-image-container');
            // Increase division factor from 1.5 to 2.5 to make cards smaller
            const rowSpan = Math.ceil((content.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap) / 2.5);
            item.style.gridRowEnd = `span ${Math.max(8, rowSpan)}`; // Reduced minimum height from 10 to 8
          }
        });
      };
  
      // Initial resize
      setTimeout(resizeGridItems, 500);
  
      // Resize on window resize
      window.addEventListener('resize', resizeGridItems);
      return () => window.removeEventListener('resize', resizeGridItems);
    }
  }, [loading, users]); // Changed from filteredUsers to users

  const handleUserClick = (userId) => {
    navigate(`/userprofile/${userId}`);
  };

  // Extract all unique interests from users for filtering
  const allInterests = [...new Set(
    users.flatMap(user => user.interests || [])
  )];

  const toggleInterestFilter = (interest) => {
    setFilterInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="people-page-container full-width">
      <div className="people-page-header">
        <h1>Explore People</h1>
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <div className="interest-filters">
            {allInterests.slice(0, 10).map(interest => (
              <button 
                key={interest}
                className={`filter-tag ${filterInterests.includes(interest) ? 'active' : ''}`}
                onClick={() => toggleInterestFilter(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Loader size="50" speed="1.75" color="white" />
        </div>
      ) : (
        <div className="masonry-grid" ref={gridRef}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div 
                key={user.id} 
                className="masonry-item"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="person-image-container">
                  <img 
                    src={user.photoURL || placeholderProfilePic}
                    alt={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                    className="person-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderProfilePic;
                    }}
                  />
                </div>
                <div className="person-info">
                  <h3>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous'}</h3>
                  {user.interests && user.interests.length > 0 && (
                    <div className="person-tags">
                      {user.interests.slice(0, 3).map((interest, index) => (
                        <span key={index} className="person-tag">{interest}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No users found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeoplePage;