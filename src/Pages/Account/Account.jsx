import React, { useEffect, useState } from "react";
import { getUserInfo } from "../../utils/userApi";
import Layout from "../../Components/Layout/Layout";
import EditProfileForm from "../../Components/Account/EditProfileForm";
import PasswordChangeForm from "../../Components/Account/PasswordChangeForm";
import OrderHistory from "../../Components/Account/OrderHistory";
import "./Account.css";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("profile"); // profile, edit, orders, password
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserInfo();
        setUser(userData);
      } catch (err) {
        setError(err.message || "Failed to fetch user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64 flex-col">
            <div className="text-red-600 text-xl mb-4">Error: {error}</div>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleEditSuccess = (updatedData) => {
    // Update the local user data with the edited information
    setUser(prev => ({ ...prev, ...updatedData }));
    setActiveSection('profile');
    // Trigger a refresh to get the latest data from the server
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-primary text-white p-6">
            <h1 className="text-2xl font-bold">My Account</h1>
            <p className="text-sm opacity-90">Manage your personal information</p>
          </div>
          
          <div className="p-8">
            {activeSection === 'profile' ? (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium text-gray-800">{user?.username || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{user?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">
                          {(user?.firstName && user?.lastName) 
                            ? `${user.firstName} ${user.lastName}` 
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Address Information</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-800">{user?.address || 'No address provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActiveSection('edit')}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setActiveSection('password')}
                    className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={() => setActiveSection('orders')}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Order History
                  </button>
                </div>
              </>
            ) : activeSection === 'edit' ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Profile</h2>
                <EditProfileForm 
                  user={user} 
                  onCancel={() => setActiveSection('profile')} 
                  onSuccess={handleEditSuccess}
                />
              </div>
            ) : activeSection === 'password' ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Change Password</h2>
                <PasswordChangeForm onCancel={() => setActiveSection('profile')} />
              </div>
            ) : activeSection === 'orders' ? (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Order History</h2>
                <OrderHistory onBack={() => setActiveSection('profile')} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
