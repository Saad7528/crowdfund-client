import React, { createContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase.config';

export const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch user details (role, credits) from our backend database
  const syncUserSession = async (email, token) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const dbUser = await response.json();
        setUser(dbUser);
      } else {
        // Token might be expired or invalid
        logout();
      }
    } catch (error) {
      console.error("Error syncing user session with backend:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get JWT token from backend
  const getJwtToken = async (email) => {
    try {
      const response = await fetch(`${API_URL}/jwt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access-token', data.token);
        return data.token;
      }
    } catch (error) {
      console.error("Error fetching JWT token:", error);
    }
    return null;
  };

  // Create User (Register)
  const createUser = async (name, email, password, photoURL, role) => {
    setLoading(true);
    // Check if Firebase API key is configured
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_APIKEY;
    
    if (isFirebaseConfigured) {
      try {
        // Register in Firebase
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, {
          displayName: name,
          photoURL: photoURL
        });
        
        // Save to backend database
        await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password, photoURL, role })
        });

        // Get JWT
        const token = await getJwtToken(email);
        if (token) {
          await syncUserSession(email, token);
        }
        return result.user;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Fallback: Direct backend registration without Firebase
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password, photoURL, role })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to register");
        }
        
        // Log in immediately
        return await loginUser(email, password);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  };

  // Login User
  const loginUser = async (email, password) => {
    setLoading(true);
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_APIKEY;

    if (isFirebaseConfigured) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const token = await getJwtToken(email);
        if (token) {
          await syncUserSession(email, token);
        }
        return result.user;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Fallback: Direct backend login
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Invalid email or password");
        }
        const data = await response.json();
        localStorage.setItem('access-token', data.token);
        setUser(data.user);
        setLoading(false);
        return data.user;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  };

  // Google Sign-In
  const loginWithGoogle = async (role = 'Supporter') => {
    setLoading(true);
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_APIKEY;

    if (isFirebaseConfigured) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const { displayName, email, photoURL } = result.user;
        
        // Sync user to database
        const response = await fetch(`${API_URL}/users/social`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: displayName, email, photoURL, role })
        });
        
        const token = await getJwtToken(email);
        if (token) {
          await syncUserSession(email, token);
        }
        return result.user;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    } else {
      // Fallback: Simulation of Google login using direct database sync
      try {
        const mockEmail = `google_${Math.floor(Math.random() * 10000)}@gmail.com`;
        const mockName = `Google User ${Math.floor(Math.random() * 100)}`;
        const mockPhoto = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100`;
        
        const response = await fetch(`${API_URL}/users/social`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: mockName, email: mockEmail, photoURL: mockPhoto, role })
        });
        const syncData = await response.json();
        
        const token = await getJwtToken(mockEmail);
        if (token) {
          await syncUserSession(mockEmail, token);
        }
        return syncData.user;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    }
  };

  const loginWithGoogleCredential = async (credentialToken, role = 'Supporter') => {
    setLoading(true);
    try {
      const base64Url = credentialToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);

      const response = await fetch(`${API_URL}/users/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name: decoded.name, 
          email: decoded.email, 
          photoURL: decoded.picture || '', 
          role 
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to sync Google account to database");
      }
      
      const token = await getJwtToken(decoded.email);
      if (token) {
        await syncUserSession(decoded.email, token);
      } else {
        setLoading(false);
        throw new Error("Failed to generate secure session token from backend");
      }
      return decoded;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('access-token');
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_APIKEY;

    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Firebase sign out error:", error);
      }
    }
    setUser(null);
    setLoading(false);
  };

  // Sync session on mount (Persist login after reload)
  useEffect(() => {
    const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_APIKEY;

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const token = localStorage.getItem('access-token') || await getJwtToken(currentUser.email);
          if (token) {
            await syncUserSession(currentUser.email, token);
          } else {
            setLoading(false);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      });
      return () => unsubscribe();
    } else {
      // Offline fallback token-based restore
      const token = localStorage.getItem('access-token');
      if (token) {
        // Decode token loosely to check email, or let `/users/me` handle it
        fetch(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Invalid token");
        })
        .then(dbUser => {
          setUser(dbUser);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('access-token');
          setUser(null);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    }
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    loginUser,
    loginWithGoogle,
    loginWithGoogleCredential,
    logout,
    syncUserSession
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
