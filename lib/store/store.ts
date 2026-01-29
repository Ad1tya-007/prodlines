import { configureStore } from '@reduxjs/toolkit';
import repositoryReducer from './repositorySlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      repository: repositoryReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
