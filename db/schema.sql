CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  rating INT DEFAULT 1200,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  white_player INT REFERENCES users(id) NOT NULL,
  black_player INT REFERENCES users(id) NOT NULL,
  start_time TIMESTAMP NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP,
  time_control INT NOT NULL,
  result VARCHAR(10),
  starting_position VARCHAR(255) NOT NULL
);

CREATE TABLE moves (
  id SERIAL PRIMARY KEY,
  game_id INT REFERENCES games(id) NOT NULL,
  move_number INT NOT NULL,
  player INT REFERENCES users(id) NOT NULL,
  piece VARCHAR(10) NOT NULL,
  from_square VARCHAR(2) NOT NULL,
  to_square VARCHAR(2) NOT NULL,
  is_capture BOOLEAN DEFAULT false,
  is_check BOOLEAN DEFAULT false,
  is_checkmate BOOLEAN DEFAULT false,
  is_castle BOOLEAN DEFAULT false,
  is_en_passant BOOLEAN DEFAULT false,
  promotion VARCHAR(10)
);

CREATE TABLE game_history (
  game_id INT REFERENCES games(id) NOT NULL,
  move_number INT NOT NULL,
  position VARCHAR(255) NOT NULL
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) NOT NULL,
  rating INT NOT NULL,
  game_id INT REFERENCES games(id) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);