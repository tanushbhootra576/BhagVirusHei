#!/usr/bin/env node
// Migration: convert legacy Issue.reporters (ObjectId[]) into new structure { user, consent, joinedAt }
// Usage: node scripts/migrateReporters.js
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Issue = require('../models/Issue');

(async () => {
  try {
    await connectDB();
    const issues = await Issue.find({ 'reporters.0': { $exists: true } }).exec();
    let updated = 0;
    for (const issue of issues) {
      if (!issue.reporters.length) continue;
      if (issue.reporters[0] && issue.reporters[0].user) continue; // already migrated
      const legacy = issue.reporters.slice();
      issue.reporters = legacy.map(id => ({ user: id, consent: true, joinedAt: new Date(issue.createdAt || Date.now()) }));
      if (issue.reportedBy && !issue.reporters.some(r => r.user.toString() === issue.reportedBy.toString())) {
        issue.reporters.push({ user: issue.reportedBy, consent: true, joinedAt: new Date(issue.createdAt || Date.now()) });
      }
      await issue.save();
      updated++;
    }
    console.log('Migration complete. Issues updated:', updated);
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  }
})();
