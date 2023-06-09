CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  picture VARCHAR(50),
  bio VARCHAR(500),
  rating INTEGER
);

CREATE TABLE games (
  gameid CHAR(36) PRIMARY KEY,
  player1 VARCHAR(50) NOT NULL,
  player2 VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  winner VARCHAR(50),
  rating1 INTEGER NOT NULL,
  rating2 INTEGER NOT NULL
);




