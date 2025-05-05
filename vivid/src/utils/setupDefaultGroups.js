import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../config/authConfig";
import communityData from "../Components/CommunityCards/CommunityData";
import { getAuth } from "firebase/auth";

// Function to create a default group in Firestore
const createDefaultGroup = async (groupData) => {
  try {
    // Get current user ID
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error("No authenticated user found");
      return { success: false, error: "No authenticated user" };
    }
    
    // Check if group with this ID already exists
    const q = query(
      collection(db, "groups"),
      where("id", "==", groupData.id)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.log(`Group ${groupData.name} already exists, skipping...`);
      return { success: true, exists: true };
    }
    
    // Create group document with current user as admin
    const groupRef = await addDoc(collection(db, "groups"), {
      id: groupData.id,
      name: groupData.name,
      bio: groupData.info,
      type: groupData.tags[0] || "General",
      rules: "Be respectful and follow community guidelines.",
      isPublic: true,
      admin: currentUser.uid, // Use current user's ID as admin
      groupPic: groupData.picture,
      createdAt: Timestamp.now(),
      members: [currentUser.uid], // Current user is automatically a member
      tags: groupData.tags
    });
    
    console.log(`Created default group: ${groupData.name}`);
    return { success: true, groupId: groupRef.id };
  } catch (error) {
    console.error(`Error creating default group ${groupData.name}:`, error);
    return { success: false, error: error.message };
  }
};

// Function to set up all default groups
export const setupDefaultGroups = async () => {
  console.log("Setting up default groups...");
  
  // Add IDs to community data if they don't exist
  const communitiesWithIds = communityData.map(community => ({
    ...community,
    id: community.id || community.name.toLowerCase().replace(/\s+/g, '-')
  }));
  
  // Create each group
  const results = [];
  for (const community of communitiesWithIds) {
    const result = await createDefaultGroup(community);
    results.push({ name: community.name, ...result });
  }
  
  console.log("Default groups setup complete:", results);
  return results;
};

export default setupDefaultGroups;