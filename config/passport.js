const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { getUsers, saveUsers } = require('../services/imagekitDb');
const imagekit = require('../config/imagekit');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!email) return done(new Error("Email permission is required"), null);

      const users = await getUsers();
      let user = users.find(u => u.googleId === profile.id || u.email === email);

      if (!user) {
        // Avatar එක ImageKit එකට Upload කිරීම
        let avatarUrl = '';
        if (profile.photos && profile.photos[0]) {
          const uploadedAvatar = await imagekit.upload({
            file: profile.photos[0].value,
            fileName: `avatar_google_${profile.id}.jpg`,
            folder: '/user_avatars'
          });
          avatarUrl = uploadedAvatar.url;
        }

        user = {
          id: 'user_' + Date.now(),
          name: profile.displayName || profile.username,
          email: email,
          googleId: profile.id,
          avatarUrl: avatarUrl,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        users.push(user);
        await saveUsers(users);
      } else if (!user.googleId) {
        user.googleId = profile.id;
        await saveUsers(users);
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!email) return done(new Error("Public email is missing from GitHub"), null);

      const users = await getUsers();
      let user = users.find(u => u.githubId === profile.id || u.email === email);

      if (!user) {
        let avatarUrl = '';
        if (profile.photos && profile.photos[0]) {
          const uploadedAvatar = await imagekit.upload({
            file: profile.photos[0].value,
            fileName: `avatar_github_${profile.id}.jpg`,
            folder: '/user_avatars'
          });
          avatarUrl = uploadedAvatar.url;
        }

        user = {
          id: 'user_' + Date.now(),
          name: profile.displayName || profile.username,
          email: email,
          githubId: profile.id,
          avatarUrl: avatarUrl,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        users.push(user);
        await saveUsers(users);
      } else if (!user.githubId) {
        user.githubId = profile.id;
        await saveUsers(users);
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));