import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Repository {
  id: string;
  full_name: string;
  owner: string;
  name: string;
  default_branch: string;
}

interface RepositoryState {
  selectedRepository: Repository | null;
}

const initialState: RepositoryState = {
  selectedRepository: null,
};

const repositorySlice = createSlice({
  name: 'repository',
  initialState,
  reducers: {
    setSelectedRepository: (
      state,
      action: PayloadAction<Repository | null>,
    ) => {
      state.selectedRepository = action.payload;
    },
    clearSelectedRepository: (state) => {
      state.selectedRepository = null;
    },
  },
});

export const { setSelectedRepository, clearSelectedRepository } =
  repositorySlice.actions;
export default repositorySlice.reducer;
