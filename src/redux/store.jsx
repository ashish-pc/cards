import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { medReducer } from "./reducer/medReducer";

const rootReducer = combineReducers({
    medReducer
});

// const initialState = {};

const middleware = [thunk];

const store = configureStore({
    reducer: rootReducer,
    // preloadedState: initialState,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), ...middleware],
    //   enhancers: [composeWithDevTools()],
});

export default store;

