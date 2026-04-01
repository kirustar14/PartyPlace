# Technical Exercise: AI-Powered Venue Search

## Overview

You will build a small full-stack application that allows users to search for event venues using natural language.

A user will enter a plain English sentence (for example, "I want to celebrate my birthday in Brooklyn for 50 people on May 5th"). Your system should interpret this request using AI, extract relevant details, and return matching venues from a provided dataset.

---

## Requirements

### 1. AI Interpretation

Use the OpenAI API to convert the user's input into a structured format.

Use the following API key for your requests:

OPENAI_API_KEY=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

The output should include fields such as:

- budget
- guest count
- location
- date
- time
- occasion

These should be usable for filtering the provided venue dataset (for example, matching against minimum budget, maximum guest capacity, etc.).

---

### 2. Venue Matching

You will be provided with a `venues.json` file containing mock data.

Based on the interpreted request, return venues that match the user's intent.

---

### 3. Validation

Define and apply a few business logic rules to determine whether a request is valid. You can use the example rule from below and define a couple rules yourself.

Examples:

- Weekend bookings may require a minimum budget

If a request is invalid, return:

- A clear explanation of the issue
- A suggested improved version of the query

---

### 4. User Interface

Provide a simple interface where a user can:

- Enter a request in natural language
- View the results of the search
- See which filters were applied from their query

---

## Technical Expectations

- Use Next.js (frontend) and NestJS (backend) with TypeScript
- Use the provided JSON file as your data source
- You may structure your code as you prefer

---

## Time Constraint

You will have **60 minutes** to work on this.

It is okay if you do not complete every part of the exercise. Focus on making meaningful progress and your approach.

---

## Evaluation Focus

- Problem breakdown and approach
- Use of AI tools
- Backend and frontend integration
- Planning
- Code clarity and structure
