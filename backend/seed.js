import mongoose from "mongoose";
import dotenv from "dotenv";

import { User } from "./models/user.js";
import { Subject } from "./models/subject.js";
import { SubTopic } from "./models/subtopic.js";
import { boardSubjects } from "./models/boardsubject.js";
import { SmallTopic } from "./models/smallTopic.js";
import { SuggestedTopic } from "./models/sugTopic.js";
import { Coursechallenge } from "./models/coursechallenge.js";

dotenv.config();

/**
 * @description Seed script that drops existing collections and populates the
 * local MongoDB database with initial data matching all schema definitions.
 *
 * Usage: node seed.js
 */
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database:", process.env.MONGO_URL);

    // =========================================================================
    // DROP EXISTING DATA
    // =========================================================================
    console.log("\nDropping existing collections...");
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      await mongoose.connection.db.dropCollection(col.name);
      console.log(`  Dropped: ${col.name}`);
    }

    // =========================================================================
    // 1. SUBJECTS — shown on the Explore page (non-board users)
    // =========================================================================
    console.log("\nSeeding subjects...");
    const subjects = await Subject.insertMany([
      { name: "Mathematics" },
      { name: "Physics" },
      { name: "Chemistry" },
      { name: "Biology" },
      { name: "Computer Science" },
      { name: "English" },
      { name: "History" },
      { name: "Geography" },
      { name: "Economics" },
      { name: "Psychology" },
    ]);
    console.log(`  Inserted ${subjects.length} subjects`);

    // =========================================================================
    // 2. BOARD SUBJECTS — shown on Explore page for board-based users
    //    (std = education level like "10", "11", "12")
    // =========================================================================
    console.log("\nSeeding board subjects...");
    const boardSubs = await boardSubjects.insertMany([
      // Standard 10
      { std: "10", subject: "Mathematics" },
      { std: "10", subject: "Science" },
      { std: "10", subject: "English" },
      { std: "10", subject: "Social Science" },
      { std: "10", subject: "Hindi" },
      // Standard 11 - Science
      { std: "11", subject: "Mathematics" },
      { std: "11", subject: "Physics" },
      { std: "11", subject: "Chemistry" },
      { std: "11", subject: "Biology" },
      { std: "11", subject: "Computer Science" },
      { std: "11", subject: "English" },
      // Standard 12 - Science
      { std: "12", subject: "Mathematics" },
      { std: "12", subject: "Physics" },
      { std: "12", subject: "Chemistry" },
      { std: "12", subject: "Biology" },
      { std: "12", subject: "Computer Science" },
      { std: "12", subject: "English" },
    ]);
    console.log(`  Inserted ${boardSubs.length} board subjects`);

    // =========================================================================
    // 3. SUBTOPICS — topic suggestions shown per subject + level
    // =========================================================================
    console.log("\nSeeding subtopics...");
    const subtopics = await SubTopic.insertMany([
      // Mathematics
      { name: "Algebra", subject: "Mathematics" },
      { name: "Calculus", subject: "Mathematics" },
      { name: "Geometry", subject: "Mathematics" },
      { name: "Trigonometry", subject: "Mathematics" },
      { name: "Statistics", subject: "Mathematics" },
      // Physics
      { name: "Mechanics", subject: "Physics" },
      { name: "Thermodynamics", subject: "Physics" },
      { name: "Electromagnetism", subject: "Physics" },
      { name: "Optics", subject: "Physics" },
      { name: "Modern Physics", subject: "Physics" },
      // Chemistry
      { name: "Organic Chemistry", subject: "Chemistry" },
      { name: "Inorganic Chemistry", subject: "Chemistry" },
      { name: "Physical Chemistry", subject: "Chemistry" },
      // Computer Science
      { name: "Data Structures", subject: "Computer Science" },
      { name: "Algorithms", subject: "Computer Science" },
      { name: "Web Development", subject: "Computer Science" },
      { name: "Database Management", subject: "Computer Science" },
      { name: "Operating Systems", subject: "Computer Science" },
      // Biology
      { name: "Cell Biology", subject: "Biology" },
      { name: "Genetics", subject: "Biology" },
      { name: "Ecology", subject: "Biology" },
      { name: "Human Anatomy", subject: "Biology" },
    ]);
    console.log(`  Inserted ${subtopics.length} subtopics`);

    // =========================================================================
    // 4. TEST USER — a demo user with enrolled subtopics and exam history
    // =========================================================================
    console.log("\nSeeding test user...");
    const testUser = new User({
      name: "Test User",
      email: "test@example.com",
      password: "test123",
      age: 20,
      board: false,
      education: "12",
      subtopic: [
        {
          name: "Algebra",
          subject: "Mathematics",
          level: "beginner",
          progress: 0,
          smallTopics: [
            "Linear Equations",
            "Quadratic Equations",
            "Polynomials",
            "Inequalities",
            "Functions and Graphs",
            "Matrices",
            "Determinants",
            "Complex Numbers",
            "Sequences and Series",
            "Logarithms",
          ],
          sugTopic: [],
        },
      ],
      exam: [],
    });
    await testUser.save();
    console.log(`  Created user: ${testUser.email}`);

    // =========================================================================
    // 5. SMALL TOPICS — individual learning units for the test user's subtopic
    // =========================================================================
    console.log("\nSeeding small topics for test user...");
    const algebraTopics = [
      "Linear Equations",
      "Quadratic Equations",
      "Polynomials",
      "Inequalities",
      "Functions and Graphs",
      "Matrices",
      "Determinants",
      "Complex Numbers",
      "Sequences and Series",
      "Logarithms",
    ];

    const smallTopicDocs = algebraTopics.map((name, index) => ({
      user: "test@example.com",
      name: name,
      subject: "Mathematics",
      subtopic: "Algebra",
      isLoaded: false,
      completed: false,
      htmlContent: null,
      order: index,
    }));
    const insertedSmallTopics = await SmallTopic.insertMany(smallTopicDocs);
    console.log(`  Inserted ${insertedSmallTopics.length} small topics`);

    // =========================================================================
    // 6. SECOND TEST USER — board-based user
    // =========================================================================
    console.log("\nSeeding board-based test user...");
    const boardUser = new User({
      name: "Board Student",
      email: "board@example.com",
      password: "board123",
      age: 16,
      board: true,
      education: "10",
      subtopic: [],
      exam: [],
    });
    await boardUser.save();
    console.log(`  Created user: ${boardUser.email}`);

    // =========================================================================
    // SUMMARY
    // =========================================================================
    console.log("\n========================================");
    console.log("Seed completed successfully!");
    console.log("========================================");
    console.log(`  Subjects:       ${subjects.length}`);
    console.log(`  Board Subjects: ${boardSubs.length}`);
    console.log(`  SubTopics:      ${subtopics.length}`);
    console.log(`  Small Topics:   ${insertedSmallTopics.length}`);
    console.log(`  Users:          2`);
    console.log("\nTest accounts:");
    console.log("  Email: test@example.com  | Password: test123  (non-board)");
    console.log("  Email: board@example.com | Password: board123 (board, std 10)");
    console.log("========================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
