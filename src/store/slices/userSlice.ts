import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Типы для данных пользователя
export interface PuffRecord {
  id: string;
  date: string;
  countPuffs: number;
}

export interface UserData {
  id: string;
  totalCount: number;
  records: PuffRecord[];
}

interface UserDataState {
  data: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserDataState = {
  data: null,
  loading: false,
  error: null
}

const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.data = null;
    },
    addPuffRecord: (state, action: PayloadAction<PuffRecord>) => {
      if (state.data) {
        state.data.records.push(action.payload);
        state.data.totalCount += action.payload.countPuffs;
      }
    },
    resetUserData: () => initialState
  },
});

export const { 
  setUserData, 
  setLoading, 
  setError, 
  addPuffRecord,
  resetUserData 
} = userSlice.actions;

export default userSlice.reducer;