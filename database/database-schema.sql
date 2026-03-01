USE `vvet_api_db`;

-- DONT MODIFY THIS MIGRATION
-- it is used by Xest local development pipeline
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `run_on` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `migrations` (
  name,
  run_on
) VALUES (
  "/20211107064324-database-schema",
  "20211107064324"
);

-- YOU CAN MODIFY BELOW THIS LINE

DROP TABLE IF EXISTS user_types;
CREATE TABLE user_types(
  user_type_id int AUTO_INCREMENT PRIMARY KEY,
  user_type VARCHAR(50) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS users;
CREATE TABLE users(
  user_id int AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(500) NOT NULL,
  user_type_id int NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_type_id) REFERENCES user_types(user_type_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS password_recovery_requests;
CREATE TABLE password_recovery_requests(
	password_recovery_request_id int AUTO_INCREMENT PRIMARY KEY,
  requested_email VARCHAR(150) NOT NULL,
	shortcode VARCHAR(40) NOT NULL UNIQUE,
  recovered_at DATETIME,
  expiry_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (requested_email) REFERENCES users(email)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS vet_profiles;
CREATE TABLE vet_profiles(
  vet_profile_id int AUTO_INCREMENT PRIMARY KEY,
  user_id int NOT NULL,
  license_number VARCHAR(100),
  specializations TEXT,
  years_experience int,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  consultation_fee DECIMAL(10, 2),
  availability_status ENUM('available', 'unavailable', 'busy') DEFAULT 'available',
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  verified_by int,
  verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (verified_by) REFERENCES users(user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS livestock_categories;
CREATE TABLE livestock_categories(
  category_id int AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS livestock_features;
CREATE TABLE livestock_features(
  feature_id int AUTO_INCREMENT PRIMARY KEY,
  category_id int NOT NULL,
  feature_name VARCHAR(100) NOT NULL,
  feature_type ENUM('text', 'number', 'boolean', 'date', 'select') NOT NULL,
  feature_options TEXT, -- JSON array for select type
  is_required BOOLEAN DEFAULT FALSE,
  display_order int DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES livestock_categories(category_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS farms;
CREATE TABLE farms(
  farm_id int AUTO_INCREMENT PRIMARY KEY,
  farmer_id int NOT NULL,
  farm_name VARCHAR(100) NOT NULL,
  description TEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  total_area_hectares DECIMAL(10, 2),
  farm_type ENUM('crop', 'livestock', 'mixed', 'dairy', 'poultry') DEFAULT 'mixed',
  established_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES users(user_id),
  UNIQUE KEY unique_farmer_farm_name (farmer_id, farm_name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS livestock;
CREATE TABLE livestock(
  livestock_id int AUTO_INCREMENT PRIMARY KEY,
  farm_id int NOT NULL,
  category_id int NOT NULL,
  name VARCHAR(100),
  tag_number VARCHAR(50),
  breed VARCHAR(100),
  age_months int,
  weight_kg DECIMAL(7, 2),
  gender ENUM('male', 'female', 'unknown'),
  birth_date DATE,
  acquisition_date DATE,
  current_health_status ENUM('healthy', 'sick', 'recovering', 'deceased') DEFAULT 'healthy',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farm_id) REFERENCES farms(farm_id),
  FOREIGN KEY (category_id) REFERENCES livestock_categories(category_id),
  UNIQUE KEY unique_farm_tag (farm_id, tag_number)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS livestock_feature_values;
CREATE TABLE livestock_feature_values(
  value_id int AUTO_INCREMENT PRIMARY KEY,
  livestock_id int NOT NULL,
  feature_id int NOT NULL,
  feature_value TEXT,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (livestock_id) REFERENCES livestock(livestock_id) ON DELETE CASCADE,
  FOREIGN KEY (feature_id) REFERENCES livestock_features(feature_id),
  UNIQUE KEY unique_livestock_feature (livestock_id, feature_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS diagnoses;
CREATE TABLE diagnoses(
  diagnosis_id int AUTO_INCREMENT PRIMARY KEY,
  livestock_id int NOT NULL,
  diagnosis_text TEXT NOT NULL,
  confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  recommended_treatment TEXT,
  severity_level ENUM('low', 'medium', 'high', 'critical'),
  rule_engine_response JSON, -- Store full AI response
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (livestock_id) REFERENCES livestock(livestock_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS verification_requests;
CREATE TABLE verification_requests(
  verification_request_id int AUTO_INCREMENT PRIMARY KEY,
  farm_id int NOT NULL,
  vet_id int,
  livestock_id int NOT NULL,
  diagnosis_id int NOT NULL,
  request_status ENUM('pending', 'assigned', 'in_review', 'completed', 'cancelled') DEFAULT 'pending',
  urgency_level ENUM('low', 'medium', 'high', 'emergency') DEFAULT 'medium',
  farmer_notes TEXT,
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_at DATETIME,
  completed_at DATETIME,
  FOREIGN KEY (farm_id) REFERENCES farms(farm_id),
  FOREIGN KEY (vet_id) REFERENCES users(user_id),
  FOREIGN KEY (livestock_id) REFERENCES livestock(livestock_id),
  FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(diagnosis_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS diagnosis_verifications;
CREATE TABLE diagnosis_verifications(
  verification_id int AUTO_INCREMENT PRIMARY KEY,
  verification_request_id int NOT NULL,
  vet_id int NOT NULL,
  verification_type ENUM('accept', 'accept_supplement', 'reject_rediagnose') NOT NULL,
  vet_diagnosis TEXT,
  vet_treatment_recommendation TEXT,
  confidence_level ENUM('low', 'medium', 'high') DEFAULT 'high',
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  vet_notes TEXT,
  verification_fee DECIMAL(10, 2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (verification_request_id) REFERENCES verification_requests(verification_request_id),
  FOREIGN KEY (vet_id) REFERENCES users(user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;