a--
description: Set up the project for first-time use by following setup.md and walking through any steps that require human intervention
allowed-tools: Bash, Edit
argument-hint: []
---

# Command: /setup

Read and execute all instructions in `setup.md` in the project root to perform initial project setup.

For each step in `setup.md`:
1. If the step can be automated, perform it directly using available tools (e.g., Bash, Edit).
2. If the step requires human action (manual configuration, external signup, secrets input, etc.), pause and display detailed instructions/highlights for the user to follow.
3. Track setup progress and verify completion status for each step.
4. Tackle each step one at a time with teh user, do not show all teh actions required at once

At the end, summarize what was completed automatically and what needs human follow-up.
