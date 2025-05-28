import { authMiddleware } from './authMiddleware';

export const applyMiddleware = (store) => {
  const middlewares = [
    authMiddleware,
    // Add other middlewares here
  ];

  return middlewares.reduce((prevFn, nextFn) => {
    return nextFn(store)(prevFn);
  }, action => action);
};