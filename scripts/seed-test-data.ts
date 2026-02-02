/**
 * Seed Test Data for Brain + Feedback Testing
 * 
 * Creates:
 * - Test users (coach, player, parent)
 * - Test athletes
 * - Test assessments
 * - Sample feedback events
 */

import { db } from "../server/db";
import { 
  users, coaches, athletes, assessments, feedbackEvents,
  type CreateCoachRequest, type CreateAthleteRequest, 
  type CreateAssessmentRequest, type CreateFeedbackEventRequest
} from "../shared/schema";
import { eq } from "drizzle-orm";

async function seedTestData() {
  console.log("🌱 Seeding test data for Brain + Feedback testing...\n");

  try {
    // Clean up existing test data
    console.log("🧹 Cleaning up existing test data...");
    await db.delete(feedbackEvents).where(eq(feedbackEvents.userId, "test_coach_1"));
    await db.delete(feedbackEvents).where(eq(feedbackEvents.userId, "test_parent_1"));
    await db.delete(assessments).where(eq(assessments.athleteId, 999));
    await db.delete(athletes).where(eq(athletes.id, 999));
    await db.delete(coaches).where(eq(coaches.userId, "test_coach_1"));
    await db.delete(users).where(eq(users.id, "test_coach_1"));
    await db.delete(users).where(eq(users.id, "test_parent_1"));
    await db.delete(users).where(eq(users.id, "test_player_1"));
    console.log("✓ Cleanup complete\n");

    // Create test users
    console.log("👥 Creating test users...");
    
    const testCoachUser = await db.insert(users).values({
      id: "test_coach_1",
      email: "coach@test.com",
      role: "coach",
      username: "TestCoach",
      displayName: "Coach Sarah"
    }).returning();
    console.log(`✓ Created coach user: ${testCoachUser[0].email}`);

    const testParentUser = await db.insert(users).values({
      id: "test_parent_1",
      email: "parent@test.com",
      role: "player",
      username: "TestParent",
      displayName: "Parent John"
    }).returning();
    console.log(`✓ Created parent user: ${testParentUser[0].email}`);

    const testPlayerUser = await db.insert(users).values({
      id: "test_player_1",
      email: "player@test.com",
      role: "player",
      username: "TestPlayer",
      displayName: "Player Emma"
    }).returning();
    console.log(`✓ Created player user: ${testPlayerUser[0].email}\n`);

    // Create test coach
    console.log("🎓 Creating test coach...");
    const testCoach = await db.insert(coaches).values({
      userId: "test_coach_1",
      name: "Coach Sarah Thompson",
      email: "coach@test.com",
      specialty: "Pitching Coach",
      certifications: ["USA Softball", "NFCA Level 3"],
      experience: 15
    } as any).returning();
    console.log(`✓ Created coach: ${testCoach[0].name}\n`);

    // Create test athlete
    console.log("⚾ Creating test athlete...");
    const testAthlete = await db.insert(athletes).values({
      id: 999,
      userId: "test_parent_1",
      firstName: "Emma",
      lastName: "Johnson",
      dob: "2011-05-15",
      primaryPosition: "Pitcher",
      school: "Lincoln Middle School",
      graduationYear: 2027,
      parentEmail: "parent@test.com",
      parentPhone: "555-0123"
    } as any).returning();
    console.log(`✓ Created athlete: ${testAthlete[0].firstName} ${testAthlete[0].lastName}\n`);

    // Create test assessment
    console.log("📊 Creating test assessment...");
    const testAssessment = await db.insert(assessments).values({
      athleteId: 999,
      coachId: testCoach[0].id,
      skillType: "PITCHING",
      videoUrl: "https://example.com/test-video.mp4",
      status: "completed",
      notes: "Test assessment for Brain testing"
    } as any).returning();
    console.log(`✓ Created assessment ID: ${testAssessment[0].id}\n`);

    // Create sample feedback events
    console.log("💬 Creating sample feedback events...");
    
    const feedbackExamples = [
      {
        userId: "test_coach_1",
        role: "coach",
        brainDecisionId: "brain_test_001",
        decisionType: "drill",
        decisionRefId: 42,
        skillType: "PITCHING",
        athleteAge: 12,
        athleteLevel: "Intermediate",
        detectedIssues: ["hunched forward"],
        rating: 5,
        action: "accepted",
        pushbackText: null
      },
      {
        userId: "test_coach_1",
        role: "coach",
        brainDecisionId: "brain_test_002",
        decisionType: "drill",
        decisionRefId: 38,
        skillType: "PITCHING",
        athleteAge: 10,
        athleteLevel: "Beginner",
        detectedIssues: ["weak leg drive"],
        rating: 2,
        action: "rejected",
        pushbackText: "Too advanced for beginners, need simpler progression"
      },
      {
        userId: "test_parent_1",
        role: "parent",
        brainDecisionId: "brain_test_003",
        decisionType: "drill",
        skillType: "HITTING",
        athleteAge: 12,
        athleteLevel: "Intermediate",
        detectedIssues: ["casting"],
        rating: 4,
        action: "completed",
        pushbackText: "Good drill, daughter improved noticeably"
      },
      {
        userId: "test_coach_1",
        role: "coach",
        brainDecisionId: "brain_test_004",
        decisionType: "goal",
        skillType: "PITCHING",
        athleteAge: 13,
        athleteLevel: "Advanced",
        detectedIssues: ["inconsistent release"],
        rating: 5,
        action: "edited",
        pushbackText: "Adjusted timeframe from 4 weeks to 6 weeks",
        editedVersion: { timeframe: "6 weeks", originalTimeframe: "4 weeks" }
      },
      {
        userId: "test_player_1",
        role: "player",
        brainDecisionId: "brain_test_005",
        decisionType: "drill",
        skillType: "CATCHING",
        athleteAge: 14,
        athleteLevel: "Advanced",
        detectedIssues: ["late transfers"],
        rating: 5,
        action: "accepted",
        pushbackText: "Love this drill! Really helps with my pop time"
      }
    ];

    for (const feedback of feedbackExamples) {
      const result = await db.insert(feedbackEvents).values(feedback as any).returning();
      console.log(`✓ Created feedback event: ${feedback.action} - ${feedback.skillType} (rating: ${feedback.rating || 'N/A'})`);
    }

    console.log("\n✅ Test data seeding complete!");
    console.log("\n📋 Summary:");
    console.log("  - 3 test users created (coach, parent, player)");
    console.log("  - 1 test coach profile");
    console.log("  - 1 test athlete (Emma Johnson, 12yo pitcher)");
    console.log("  - 1 test assessment");
    console.log("  - 5 sample feedback events");
    console.log("\n🔐 Test Credentials:");
    console.log("  Coach: coach@test.com");
    console.log("  Parent: parent@test.com");
    console.log("  Player: player@test.com");
    console.log("  (Password: set up in your auth system)");
    console.log("\n🚀 Ready to test!");

  } catch (error) {
    console.error("❌ Error seeding test data:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedTestData()
    .then(() => {
      console.log("\n✨ Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Failed:", error);
      process.exit(1);
    });
}

export { seedTestData };
