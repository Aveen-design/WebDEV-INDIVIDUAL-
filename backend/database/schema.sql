
DROP TABLE IF EXISTS disputes        CASCADE;
DROP TABLE IF EXISTS notifications   CASCADE;
DROP TABLE IF EXISTS messages        CASCADE;
DROP TABLE IF EXISTS reviews         CASCADE;
DROP TABLE IF EXISTS payments        CASCADE;
DROP TABLE IF EXISTS bookings        CASCADE;
DROP TABLE IF EXISTS vehicle_photos  CASCADE;
DROP TABLE IF EXISTS vehicles        CASCADE;
DROP TABLE IF EXISTS users           CASCADE;



CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(100)        NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  phone         VARCHAR(20),
  role          VARCHAR(20)         NOT NULL DEFAULT 'customer'
                  CHECK (role IN ('customer', 'owner', 'admin')),
  avatar_url    TEXT,
  is_verified   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  google_id     VARCHAR(255) UNIQUE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);


CREATE TABLE vehicles (
  id                  SERIAL PRIMARY KEY,
  owner_id            INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title               VARCHAR(200) NOT NULL,
  type                VARCHAR(50)  NOT NULL
                        CHECK (type IN ('car','motorcycle','suv','van','bus','jeep','electric')),
  brand               VARCHAR(100) NOT NULL,
  model               VARCHAR(100) NOT NULL,
  year                SMALLINT    NOT NULL,
  transmission        VARCHAR(20)  CHECK (transmission IN ('automatic','manual')),
  fuel_type           VARCHAR(20)  CHECK (fuel_type IN ('petrol','diesel','electric','hybrid')),
  seats               SMALLINT    DEFAULT 5,
  daily_rate          NUMERIC(10,2) NOT NULL,
  driver_rate         NUMERIC(10,2) DEFAULT 0,
  has_driver          BOOLEAN      DEFAULT FALSE,
  driver_only         BOOLEAN      DEFAULT FALSE,
  location            VARCHAR(200) NOT NULL,
  latitude            DECIMAL(9,6),
  longitude           DECIMAL(9,6),
  description         TEXT,
  features            TEXT[],
  is_available        BOOLEAN      DEFAULT TRUE,
  is_active           BOOLEAN      DEFAULT TRUE,
  verification_status VARCHAR(20)  DEFAULT 'pending'
                        CHECK (verification_status IN ('pending','approved','rejected')),
  average_rating      DECIMAL(3,2) DEFAULT 0,
  total_reviews       INT          DEFAULT 0,
  created_at          TIMESTAMP    DEFAULT NOW(),
  updated_at          TIMESTAMP    DEFAULT NOW()
);



CREATE TABLE vehicle_photos (
  id          SERIAL PRIMARY KEY,
  vehicle_id  INT  NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  is_primary  BOOLEAN  DEFAULT FALSE,
  order_index SMALLINT DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE bookings (
  id               SERIAL PRIMARY KEY,
  vehicle_id       INT          NOT NULL REFERENCES vehicles(id),
  customer_id      INT          NOT NULL REFERENCES users(id),
  owner_id         INT          NOT NULL REFERENCES users(id),
  start_date       DATE         NOT NULL,
  end_date         DATE         NOT NULL,
  total_days       INT          NOT NULL,
  daily_rate       NUMERIC(10,2) NOT NULL,
  driver_required  BOOLEAN      DEFAULT FALSE,
  driver_rate      NUMERIC(10,2) DEFAULT 0,
  subtotal         NUMERIC(10,2) NOT NULL,
  platform_fee     NUMERIC(10,2) DEFAULT 0,
  total_amount     NUMERIC(10,2) NOT NULL,
  status           VARCHAR(30)  DEFAULT 'pending'
                     CHECK (status IN (
                       'pending','confirmed','handed_over',
                       'returned','completed','cancelled','rejected'
                     )),
  pickup_location  TEXT,
  customer_note    TEXT,
  reference_code   VARCHAR(20)  UNIQUE NOT NULL,
  created_at       TIMESTAMP    DEFAULT NOW(),
  updated_at       TIMESTAMP    DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);



CREATE TABLE payments (
  id             SERIAL PRIMARY KEY,
  booking_id     INT          NOT NULL REFERENCES bookings(id),
  customer_id    INT          NOT NULL REFERENCES users(id),
  amount         NUMERIC(10,2) NOT NULL,
  method         VARCHAR(30)  NOT NULL
                   CHECK (method IN ('esewa','khalti','card','cash')),
  status         VARCHAR(20)  DEFAULT 'pending'
                   CHECK (status IN ('pending','completed','failed','refunded')),
  transaction_id VARCHAR(255),
  paid_at        TIMESTAMP,
  created_at     TIMESTAMP    DEFAULT NOW()
);



CREATE TABLE reviews (
  id           SERIAL PRIMARY KEY,
  booking_id   INT      NOT NULL REFERENCES bookings(id),
  vehicle_id   INT      NOT NULL REFERENCES vehicles(id),
  reviewer_id  INT      NOT NULL REFERENCES users(id),
  owner_id     INT      NOT NULL REFERENCES users(id),
  rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  owner_reply  TEXT,
  replied_at   TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE (booking_id, reviewer_id)
);



CREATE TABLE messages (
  id           SERIAL PRIMARY KEY,
  booking_id   INT     NOT NULL REFERENCES bookings(id),
  sender_id    INT     NOT NULL REFERENCES users(id),
  recipient_id INT     NOT NULL REFERENCES users(id),
  content      TEXT    NOT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT NOW()
);



CREATE TABLE notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INT     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50)  NOT NULL,
  title      VARCHAR(200) NOT NULL,
  body       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE disputes (
  id          SERIAL PRIMARY KEY,
  booking_id  INT  NOT NULL REFERENCES bookings(id),
  raised_by   INT  NOT NULL REFERENCES users(id),
  reason      TEXT NOT NULL,
  status      VARCHAR(20) DEFAULT 'open'
                CHECK (status IN ('open','under_review','resolved','closed')),
  resolution  TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();