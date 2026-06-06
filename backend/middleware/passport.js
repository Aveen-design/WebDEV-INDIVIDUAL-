const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    const googleUser = {
      google_id:  profile.id,
      full_name:  profile.displayName,
      email:      profile.emails[0].value,
      avatar_url: profile.photos?.[0]?.value || null,
    };
    return done(null, googleUser);
  }
));

module.exports = passport;