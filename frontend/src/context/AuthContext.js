import React, { createContext, useContext, useState, useEffect } from 'react';



const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userlogindetails, setUserLoginDetails] = useState("");
  
  const [currentUserUid, setCurrentUserUid] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUserUid')) || null;
    } catch (error) {
      console.error("Invalid JSON in localStorage for 'currentUserUid':", error);
      localStorage.removeItem('currentUserUid');
      return null;
    }
  });
  const [IdToken, setidToken] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('idToken')) || null;
    } catch (error) {
      console.error("Invalid JSON in localStorage for 'idToken':", error);
      localStorage.removeItem('idToken');
      return null;
    }
  });
  
  const [authOperation, setAuthOperation] = useState(null); // Track auth operation
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch (error) {
      console.error("Invalid JSON in localStorage for 'currentUser':", error);
      localStorage.removeItem('currentUser');
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      setAuthOperation('login'); // Set loading state or authentication operation
  
      // Making the API call
      const response = await fetch('http://localhost:4000/share2grow/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Handling response
      const data = await response.json();
      if (response.ok) {
        const { userDetails, idToken,uid } = data; // Destructure data returned from the API
        // Set the current user and idToken in state
        setCurrentUser(userDetails);
        setidToken(idToken);
        setCurrentUserUid(uid)
  
        // Save the current user and idToken in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(userDetails));
        localStorage.setItem('idToken', JSON.stringify(idToken));
        localStorage.setItem('currentUserUid', JSON.stringify(uid));
        } else {
        // Throw error if the response is not OK (handle server-side errors)
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      // Log error for debugging
      console.error('Error signing in:', error.message || error);
  
      // Optional: You can display an error message to the user here, e.g.:
      // setErrorMessage('Login failed. Please try again.');
    } finally {
      setAuthOperation(null); // Reset the loading state or auth operation state
    }
  };
  

  const logout = async () => {
    try {
      const token = IdToken || JSON.parse(localStorage.getItem('idToken')); // Fallback to localStorage
  
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      const response = await fetch('http://localhost:4000/share2grow/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Send idToken as Bearer token
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Logout successful:', data.message);
  
        localStorage.removeItem('currentUser');
        localStorage.removeItem('idToken');
        localStorage.removeItem('currentUserUid');
        setCurrentUser(null);
        setidToken(null);
        setCurrentUserUid(null)
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };
  
  useEffect(() => {
    if (currentUser) {
      // Update localStorage whenever currentUser or IdToken changes
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('idToken', JSON.stringify(IdToken));
      localStorage.setItem('currentUserUid', JSON.stringify(currentUserUid));
    } else {
      // Clear localStorage if currentUser is null
      localStorage.removeItem('currentUser');
      localStorage.removeItem('idToken');
      localStorage.removeItem('currentUserUid');
    }
  }, [currentUser, IdToken]);
  
  

  const value = {
    currentUser,
    login,
    logout,
    currentUserUid,
  };

  return (
    <AuthContext.Provider value={value}>
      { children}
    </AuthContext.Provider>
  );
}


