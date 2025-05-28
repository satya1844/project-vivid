import { auth } from '../config/authConfig';
import { onAuthStateChanged } from 'firebase/auth';

export const authMiddleware = (store) => (next) => (action) => {
  // Check authentication state before proceeding
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        action.user = user;
        resolve(next(action));
      } else {
        // No user is signed in
        resolve(next({ type: 'AUTH_ERROR', payload: 'User not authenticated' }));
      }
    });
  });
};