import { createSlice } from "@reduxjs/toolkit";
import { fetchUserAction } from "../../action";

const initialState = {
    username:"",
    email:"",
    walletAddress: "",
    subscriberCount: -2,
    subscription: []
}

const UserSlice = createSlice({
    name:"userslice",
    initialState,
    reducers:{
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.walletAddress = action.payload.walletAddress;
            state.subscriberCount = action.payload.subscriberCount;
            state.subscription = action.payload.subscription;
        },
        resetUser: (state, action) => {
            state.username = "";
            state.email = "";
            state.walletAddress = "";
            state.subscriberCount = -2;
            state.subscription = [];
        },
        updateUser: (state, action) => {
           Object.assign(state, action.payload); //mutable approach 
        }
    },
})

export const {setUser, resetUser,updateUser} = UserSlice.actions;
export default UserSlice.reducer;