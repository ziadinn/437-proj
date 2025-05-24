import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useProfileContext } from "../contexts/ProfileContext";

export const Settings: React.FC = () => {
  const {
    username: contextUsername,
    bio: contextBio,
    visibility: contextVisibility,
    theme: contextTheme,
    updateProfile,
  } = useProfileContext();
  const [username, setUsername] = useState(contextUsername);
  const [bio, setBio] = useState(contextBio);
  const [visibility, setVisibility] = useState(contextVisibility);
  const [theme, setTheme] = useState(contextTheme);
  const navigate = useNavigate();

  // Sync local state with context when context changes
  useEffect(() => {
    setUsername(contextUsername);
    setBio(contextBio);
    setVisibility(contextVisibility);
    setTheme(contextTheme);
  }, [contextUsername, contextBio, contextVisibility, contextTheme]);

  const headerNav = (
    <>
      <div className="divide-x">
        <Link to="/" className="text-accent text-decoration-none">
          Home
        </Link>
        <Link to="/profile" className="text-accent text-decoration-none">
          Profile
        </Link>
      </div>
    </>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update the profile context with new values
    updateProfile({
      username,
      bio,
      visibility,
      theme,
    });

    console.log("Settings saved:", { username, bio, visibility, theme });

    // Navigate back to profile page to see changes
    navigate("/profile");
  };

  return (
    <Layout headerNav={headerNav}>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile-description">Profile Description</label>
          <textarea
            id="profile-description"
            name="profile-description"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="form-group">
          <fieldset>
            <legend>Blog Visibility</legend>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="visibility-public"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={(e) =>
                    setVisibility(e.target.value as "public" | "private")
                  }
                />
                <label htmlFor="visibility-public">Public</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="visibility-private"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={(e) =>
                    setVisibility(e.target.value as "public" | "private")
                  }
                />
                <label htmlFor="visibility-private">Private</label>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="form-group">
          <fieldset>
            <legend>Theme</legend>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="theme-dark"
                  name="theme"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={(e) => setTheme(e.target.value as "dark" | "light")}
                />
                <label htmlFor="theme-dark">Dark</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="theme-light"
                  name="theme"
                  value="light"
                  checked={theme === "light"}
                  onChange={(e) => setTheme(e.target.value as "dark" | "light")}
                />
                <label htmlFor="theme-light">Light</label>
              </div>
            </div>
          </fieldset>
        </div>

        <button type="submit" className="button">
          Save Settings
        </button>
      </form>
    </Layout>
  );
};
