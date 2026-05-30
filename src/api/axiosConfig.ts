import axios from 'axios';

// 1. Create the instance with your Spring Boot base URL
const api = axios.create({
    baseURL: 'http://localhost:8081/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. REQUEST INTERCEPTOR: The Outbound Bouncer
// Runs BEFORE every request leaves the browser
api.interceptors.request.use(
    (config) => {
        // Grab the token securely from where UserContext saved it
        const token = localStorage.getItem('token');
        
        if (token && config.headers) {
            // Attach it to the Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. RESPONSE INTERCEPTOR: The Inbound Cleanup Crew
// Runs BEFORE your component's .then() or .catch() sees the response
api.interceptors.response.use(
    (response) => {
        // If the request succeeds, just pass it through
        return response;
    },
    (error) => {
        // If the backend kicks it back as 401 Unauthorized (expired or invalid token)
        if (error.response && error.response.status === 401) {
            console.warn("Token expired or invalid. Scrubbing local state...");
            
            // Nuke the dead token
            localStorage.removeItem('token');
            
            // Trigger the exact same sign-in modal event you used in OAuth2RedirectHandler
            window.dispatchEvent(new Event('open-signin'));
            
            // Optional: Hard redirect to home if they were on a deeply protected page
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;