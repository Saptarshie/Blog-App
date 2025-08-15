import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "@/store/slices/blog-slice";
import userReducer from "@/store/slices/user-slice";

export const  store = configureStore({
    reducer: {
        blog: blogReducer,
        userslice: userReducer
    }
});