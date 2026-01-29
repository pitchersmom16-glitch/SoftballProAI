/**
 * Role-Based Access Control Middleware
 * Ensures users can only access routes for their assigned role
 */

import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export function requireRole(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // First check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ 
          message: "Unauthorized - Please log in" 
        });
      }

      // Get user ID from session
      const userId = (req.user as any).claims?.sub || (req.user as any).id;
      
      if (!userId) {
        return res.status(401).json({ 
          message: "Unauthorized - Invalid session" 
        });
      }

      // Fetch user from database to get their role
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ 
          message: "Unauthorized - User not found" 
        });
      }

      // Check if user has required role
      if (!user.role || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: "Forbidden - Insufficient permissions",
          required: allowedRoles,
          current: user.role || "none"
        });
      }

      // Attach user to request for downstream handlers
      (req as any).currentUser = user;
      
      next();
    } catch (error) {
      console.error("[RequireRole] Authorization error:", error);
      return res.status(500).json({ 
        message: "Internal server error during authorization" 
      });
    }
  };
}

/**
 * Middleware to check if authenticated user owns a resource
 * @param getResourceOwnerId - Function to extract owner ID from request
 */
export function requireOwnership(
  getResourceOwnerId: (req: Request) => Promise<string | number | null>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = (req.user as any).claims?.sub || (req.user as any).id;
      const resourceOwnerId = await getResourceOwnerId(req);

      if (!resourceOwnerId || String(resourceOwnerId) !== String(userId)) {
        return res.status(403).json({ 
          message: "Forbidden - You do not own this resource" 
        });
      }

      next();
    } catch (error) {
      console.error("[RequireOwnership] Authorization error:", error);
      return res.status(500).json({ 
        message: "Internal server error during ownership check" 
      });
    }
  };
}
