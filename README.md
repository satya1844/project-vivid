# Vivid Project Documentation

## Project Overview
Vivid is a user-centric web application designed to facilitate user profile creation, editing, and social connectivity. It leverages React for the frontend and Firebase (Firestore) for backend data storage and authentication. The app supports profile image cropping, social links, and dynamic user dashboards.

## Main Features
- User authentication and session management
- Profile setup with image upload and cropping
- Editable user profiles with support for skills, interests, and social links
- Firestore integration for persistent user data
- Responsive UI with modals and loaders
- Social connection requests and status tracking

## Technology Stack
- **Frontend:** React (Functional Components, Hooks)
- **Backend/Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Image Handling:** FileReader API, custom cropping modal
- **Styling:** CSS Modules
- **Icons:** react-icons

## Key Modules & Implementation Details

### 1. User Authentication
- Managed via Firebase Auth context (`useAuth` hook)
- Ensures only authenticated users can access dashboard and profile setup

### 2. Profile Setup (`ProfileSetup.jsx`)
- Allows new users to upload a profile picture, enter name, bio, mood, and select interests
- Uses FileReader to preview images before upload
- Saves user data to Firestore under the `users` collection

### 3. User Dashboard (`UserdashBoard.jsx`)
- Fetches user data from Firestore using the current user's UID
- Displays profile info, skills, interests, and social links
- Allows editing profile via a modal (`EditProfile`)
- Handles loading state with a Loader component

### 4. Edit Profile (`editProfile.jsx`)
- Modal form for updating user details
- Supports image cropping via `ImageCropModal`
- Updates only changed fields in Firestore for efficiency
- Handles social links, skills, interests, and more

### 5. User Profile View (`UserProfile.jsx`)
- Displays another user's profile based on URL param
- Shows connection status (none, pending, connected)
- Allows sending connection requests (stored in `connectionRequests` collection)

### 6. Image Cropping & Upload
- Profile images are uploaded and previewed using FileReader
- Cropping handled by a custom modal (`ImageCropModal`)
- Cropped images are stored as base64 URLs or uploaded to storage (if implemented)

### 7. Firestore Integration
- User data is stored in the `users` collection
- Connection requests and connections are managed in their respective collections
- Data fetching and updates use Firestore's `getDoc`, `setDoc`, and `updateDoc`

## Data Flow
1. **Authentication:** User logs in via Firebase Auth.
2. **Profile Setup:** Onboarding form saves user data to Firestore.
3. **Dashboard/Profile:** Components fetch user data and display it.
4. **Edit Profile:** Modal allows updates, which are patched to Firestore.
5. **Image Handling:** Images are previewed, cropped, and saved as part of user data.
6. **Connections:** Users can send/accept connection requests, updating Firestore collections.

## Important Files & Their Roles
- `src/context/AuthContext.js`: Manages authentication state
- `pages/ProfileSetup/ProfileSetup.jsx`: Profile onboarding
- `pages/UserdashBoard/UserdashBoard.jsx`: Main user dashboard
- `pages/editProfile/editProfile.jsx`: Profile editing modal
- `src/Components/UserProfile/UserProfile.jsx`: Public user profile view
- `src/Components/ImageCropModal/ImageCropModal.jsx`: Image cropping modal
- `src/config/authConfig.js`: Firebase configuration

## Configuration & Deployment
1. **Firebase Setup:**
   - Create a Firebase project
   - Enable Firestore and Authentication
   - Add your Firebase config to `src/config/authConfig.js`
2. **Install Dependencies:**
   - Run `npm install` in the project root
3. **Start Development Server:**
   - Run `npm run dev` or `npm start`
4. **Build for Production:**
   - Run `npm run build`

## Notes
- Ensure Firebase rules are set to allow authenticated reads/writes
- For production, consider uploading images to Firebase Storage instead of storing base64 in Firestore
- The UI is responsive and uses CSS modules for scoped styling

---
For further details, refer to the source code and comments within each component.