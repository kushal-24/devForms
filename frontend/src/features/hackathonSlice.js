import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hackathons: [],
    selectedHackathon: null,
    loading: false,
    error: null,
    regMsg: null
}

const hackathonSlice = createSlice({
    name: 'hackathon',
    initialState,
    reducers: {
        clearSelectedHackathon: (state, action) => {
            state.selectedHackathon = null;
        },
        clearHackathonError: (state) => {
            state.error = null;
        },
        clearRegistrationMessage: (state) => {
            state.registrationMessage = null;
        },
    }
})

export const {clearHackathonError, clearRegistrationMessage, clearSelectedHackathon}=hackathonSlice.actions;
export default hackathonSlice.reducer;