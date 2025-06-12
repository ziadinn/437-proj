import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ProfileContextType {
  username: string;
  bio: string;
  profileImage: string;
  visibility: 'public' | 'private';
  theme: 'dark' | 'light';
  updateProfile: (updates: Partial<ProfileData>) => void;
}

interface ProfileData {
  username: string;
  bio: string;
  visibility: 'public' | 'private';
  theme: 'dark' | 'light';
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage] = useState(''); // Will be populated when user logs in
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const updateProfile = (updates: Partial<ProfileData>) => {
    if (updates.username !== undefined) {
      setUsername(updates.username);
    }
    if (updates.bio !== undefined) {
      setBio(updates.bio);
    }
    if (updates.visibility !== undefined) {
      setVisibility(updates.visibility);
    }
    if (updates.theme !== undefined) {
      setTheme(updates.theme);
    }
  };

  const contextValue: ProfileContextType = {
    username,
    bio,
    profileImage,
    visibility,
    theme,
    updateProfile,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}; 