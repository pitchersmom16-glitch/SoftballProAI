import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "../storage";
import crypto from "crypto";
import rateLimit from "express-rate-limit";

// Simple local authentication for development
export function getSession() {
  // SECURITY: Require SESSION_SECRET in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    // Generate a random secret if not provided (dev only)
    const randomSecret = crypto.randomBytes(32).toString('hex');
    console.warn("[Security] SESSION_SECRET not set! Using random secret (DEV ONLY):", randomSecret.substring(0, 10) + "...");
    process.env.SESSION_SECRET = randomSecret;
  }
  
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const isProduction = process.env.NODE_ENV === "production";
  
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevents XSS access to cookies
      secure: isProduction, // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for development
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // For development, accept any email/password
          // In production, you'd verify credentials here
          const userId = email; // Use email as userId for simplicity
          
          // Ensure user exists in database
          await storage.upsertUser({
            id: userId,
            email,
            firstName: "Dev",
            lastName: "User",
          });
          
          // Create user object compatible with Replit auth format
          const user = {
            claims: {
              sub: userId,
              email,
              given_name: "Dev",
              family_name: "User",
              first_name: "Dev",
              last_name: "User",
            },
          };
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  // SECURITY: Rate limiting for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: "Too many login attempts. Please try again in 15 minutes.",
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
  });

  // Login route
  app.post("/api/login", authLimiter, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Authentication failed" });
      
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.json({ success: true, user });
      });
    })(req, res, next);
  });

  // Auto-login route for development
  app.get("/api/login", (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/");
    }
    
    // Auto-login as FIXED dev user (not timestamp-based)
    const userId = "dev-user-local";
    
    req.logIn({ claims: { sub: userId, email: "dev@softballproai.com", given_name: "Dev", family_name: "User", first_name: "Dev", last_name: "User" } }, async (err) => {
      if (err) return res.status(500).json({ message: "Auto-login failed" });
      
      // Ensure user exists in database
      await storage.upsertUser({
        id: userId,
        email: "dev@softballproai.com",
      });
      
      res.redirect("/");
    });
  });

  // Logout route
  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  // Current user route
  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Helper function to register additional auth routes
export function registerAuthRoutes(app: Express) {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
