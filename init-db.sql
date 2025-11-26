-- Initialize database tables
-- This script runs automatically when the database container starts for the first time

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "playerName" VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scores_player ON scores("playerName");
CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user ON scores("userId");

-- Insert a default admin user (password: admin123)
-- Note: In production, you should change this password immediately
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2b$10$Xm6KjNVvvFZJXK/h8xJ0xO5rQDZ0b0t5vJR4qO9E3LZjYvZtVqp.S', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert a default regular user (password: user123)
INSERT INTO users (username, password, role) 
VALUES ('testuser', '$2b$10$lZK0HLtK9cVFY5Ov8Mj1ueV5YVdqWV5/qG5xV0eQXmR8wH1Fz9Y8y', 'user')
ON CONFLICT (username) DO NOTHING;
