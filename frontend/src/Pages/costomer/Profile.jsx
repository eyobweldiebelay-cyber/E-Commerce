import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

import api from '../../api/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
  try {
    setLoading(true);
    setError('');

    const response = await api.get('/auth/profile');
    console.log('Profile API response:', response.data);

    setProfile(
      response.data.user ||
      response.data.profile ||
      response.data.data ||
      response.data
    );
  } catch (error) {
    console.error('Failed to load profile:', error);

    setError(
      error.response?.data?.message ||
      'Failed to load profile.'
    );
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <main className="profile-page">
        <div className="container">
          <div className="page-loading">
            Loading profile...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page">
        <div className="container">
          <div className="products-error">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="container">

        <div className="profile-header">
          <User size={30} />

          <div>
            <h2>My Profile  Information</h2>
            
          </div>
        </div>

        <div className="profile-card">

          <div className="profile-item">
            <User size={20} />

            <div>
              <span>Name</span>
              <strong>
                {profile?.name || 'Not provided'}
              </strong>
            </div>
          </div>

          <div className="profile-item">
            <Mail size={20} />

            <div>
              <span>Email</span>
              <strong>
                {profile?.email || 'Not provided'}
              </strong>
            </div>
          </div>

          <div className="profile-item">
            <Phone size={20} />

            <div>
              <span>Phone</span>
              <strong>
                {profile?.phone || 'Not provided'}
              </strong>
            </div>
          </div>

          <div className="profile-item">
            <MapPin size={20} />

            <div>
              <span>Address</span>
              <strong>
                {profile?.address || 'Not provided'}
              </strong>
            </div>
          </div>

          <div className="profile-item">
            <User size={20} />

            <div>
              <span>Role</span>
              <strong>
                {profile?.role || 'customer'}
              </strong>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

export default Profile;