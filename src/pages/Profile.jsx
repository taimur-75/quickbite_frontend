// src/pages/Profile.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import './Profile.css'; // Create this CSS file for styling

const Profile = () => {
  const { user, isAuthenticated, loading } = useAuth(); // Get user data, auth status, and loading state

  // You might want a more sophisticated loading state or redirect logic here
  // For now, if loading is true or user is null (shouldn't happen with ProtectedRoute, but good for safety)
  if (loading || !user) {
    // This state should ideally be handled by ProtectedRoute, but a fallback is good.
    // If you see this, it means ProtectedRoute might not be working as expected or initial load is slow.
    return (
      <div className="profile-loading-container">
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <Navbar />
      <main className="profile-container">
        <h2 className="profile-title">Your Profile</h2>
        <div className="profile-details">
          <div className="detail-item">
            <strong>Name:</strong> <span>{user.name}</span>
          </div>
          <div className="detail-item">
            <strong>Email:</strong> <span>{user.email}</span>
          </div>
          <div className="detail-item">
            <strong>Role:</strong> <span>{user.role}</span>
          </div>
          {/* You can add more user details here as needed */}
        </div>
        {/* Add buttons for editing profile, changing password etc. later */}
        {/* <button className="edit-profile-btn">Edit Profile</button> */}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
