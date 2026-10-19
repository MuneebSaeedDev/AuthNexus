import { configureStore } from "@reduxjs/toolkit"; 
// Redux mein configureStore() ek function hai jo aapke Redux application ka store create aur configure karta hai.
// Simple words mein: Redux store woh central place hai jahan aapki application ka global state store hota hai, aur configureStore() us store ko properly set up karne mein help karta hai.

import authReducer from '../features/auth/authSlice'
// authReducer authentication se related state manage karega, jaise:
// - User login hua hai ya nahi.
// - Logged -in user ka data kya hai.
// - User ka role super_admin hai ya user.
// - Login request loading mein hai ya error aaya hai.
// - Logout ke baad authentication state clear karna.

import usersReducer from "../features/users/usersSlice";
// usersReducer users ki list aur individual users se related state manage karega, khaas taur par aapke admin dashboard mein.
// - Tamam users ki list store karna.
// - Kisi specific user ka data manage karna.
// - Users fetch karte waqt loading state manage karna.
// - API se error aane par error state manage karna.
// - User delete hone ke baad list update karna.

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
    },
});