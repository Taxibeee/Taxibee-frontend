import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import { injectStore } from './slices/auth/authActions';



// Confugure the Redux Store
const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add other reducers here as your application grows
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/loginSuccess', 'auth/signupSuccess'],
            },
        }),
})

// Inject store reference to authActions to handle circular dependency
injectStore(store)

export default store;

// Export types for Typescipt support
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
