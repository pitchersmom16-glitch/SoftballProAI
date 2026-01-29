/**
 * CLEANUP SCRIPT: Remove dev users from database
 * Run with: npm run clean:dev
 */

// Load environment variables
import { config } from "dotenv";
config();

import { db } from "../server/db";
import { users, playerOnboarding, playerCheckins } from "../shared/schema";
import { eq, or, like } from "drizzle-orm";

async function cleanDevUsers() {
  console.log("🧹 Cleaning dev users from database...\n");

  try {
    // Find all dev users
    const devUsers = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, "dev@softballproai.com"),
          like(users.id, "dev-user%")
        )
      );

    if (devUsers.length === 0) {
      console.log("✅ No dev users found. Database is clean!");
      process.exit(0);
    }

    console.log(`Found ${devUsers.length} dev user(s):`);
    devUsers.forEach((u) => {
      console.log(`  - ID: ${u.id}, Email: ${u.email}, Role: ${u.role || "none"}`);
    });
    console.log();

    // Delete related data first (foreign key constraints)
    for (const user of devUsers) {
      console.log(`🗑️  Deleting data for user: ${user.id}`);

      // Delete player check-ins
      const deletedCheckins = await db
        .delete(playerCheckins)
        .where(eq(playerCheckins.userId, user.id))
        .returning();
      if (deletedCheckins.length > 0) {
        console.log(`   ✓ Deleted ${deletedCheckins.length} check-in(s)`);
      }

      // Delete player onboarding
      const deletedOnboarding = await db
        .delete(playerOnboarding)
        .where(eq(playerOnboarding.userId, user.id))
        .returning();
      if (deletedOnboarding.length > 0) {
        console.log(`   ✓ Deleted onboarding record`);
      }

      // Add more related data deletions here as needed
      // (assessments, goals, etc.)
    }

    // Finally, delete the users
    const deletedUsers = await db
      .delete(users)
      .where(
        or(
          eq(users.email, "dev@softballproai.com"),
          like(users.id, "dev-user%")
        )
      )
      .returning();

    console.log();
    console.log(`✅ SUCCESS! Deleted ${deletedUsers.length} dev user(s)`);
    console.log();
    console.log("🎯 Database is now clean and ready for fresh testing!");
    console.log("   Run 'npm run dev' to start the server.");
    
  } catch (error) {
    console.error("❌ ERROR cleaning dev users:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the cleanup
cleanDevUsers();
