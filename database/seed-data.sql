/* Initialize DB with some seed data */
USE `vvet_api_db`;

-- DONT MODIFY THIS MIGRATION
-- it is used by Xest local development pipeline
INSERT INTO `migrations` (
  name,
  run_on
) VALUES (
  "/20211107064324-seed-data",
  "20211107064324"
);

-- YOU CAN MODIFY BELOW THIS LINE
-- USER TYPES
INSERT INTO user_types (user_type_id, user_type)
VALUES (1, "admin");
INSERT INTO user_types (user_type_id, user_type)
VALUES (2, "farmer");
INSERT INTO user_types (user_type_id, user_type)
VALUES (3, "vet");

-- SAMPLE USERS
INSERT INTO users (user_id, first_name, last_name, email, password, user_type_id, phone, address, created_at)
VALUES (1, "Admin", "User", "admin@vvet.com", SHA2(CONCAT("password","SECRET_SALT"), 224), 1, "+1234567890", "Admin Office, City Center", "2020-11-20 12:00:00");

INSERT INTO users (user_id, first_name, last_name, email, password, user_type_id, phone, address, created_at)
VALUES (2, "John", "Farmer", "farmer@example.com", SHA2(CONCAT("password","SECRET_SALT"), 224), 2, "+1234567891", "Farm Road 123, Rural Area", "2020-11-20 12:00:00");

INSERT INTO users (user_id, first_name, last_name, email, password, user_type_id, phone, address, created_at)
VALUES (3, "Dr. Sarah", "Wilson", "vet@example.com", SHA2(CONCAT("password","SECRET_SALT"), 224), 3, "+1234567892", "Veterinary Clinic, Main Street", "2020-11-20 12:00:00");

-- LIVESTOCK CATEGORIES
INSERT INTO livestock_categories (category_id, category_name, description)
VALUES (1, "Cattle", "Cows, bulls, steers, and heifers");

INSERT INTO livestock_categories (category_id, category_name, description)
VALUES (2, "Sheep", "Ewes, rams, and lambs");

INSERT INTO livestock_categories (category_id, category_name, description)
VALUES (3, "Goats", "Does, bucks, and kids");

INSERT INTO livestock_categories (category_id, category_name, description)
VALUES (4, "Pigs", "Sows, boars, and piglets");

INSERT INTO livestock_categories (category_id, category_name, description)
VALUES (5, "Poultry", "Chickens, ducks, and other birds");

-- LIVESTOCK FEATURES FOR CATTLE
INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (1, 1, "Body Temperature (°C)", "number", TRUE, 1);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (2, 1, "Heart Rate (BPM)", "number", FALSE, 2);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (3, 1, "Respiratory Rate", "number", FALSE, 3);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, feature_options, is_required, display_order)
VALUES (4, 1, "Appetite Level", "select", '["Normal", "Reduced", "Poor", "Absent"]', TRUE, 4);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, feature_options, is_required, display_order)
VALUES (5, 1, "Activity Level", "select", '["Normal", "Lethargic", "Restless", "Aggressive"]', TRUE, 5);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (6, 1, "Symptoms Observed", "text", TRUE, 6);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (7, 1, "Duration of Symptoms (days)", "number", TRUE, 7);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, feature_options, is_required, display_order)
VALUES (8, 1, "Milk Production", "select", '["Normal", "Decreased", "Stopped", "Not Applicable"]', FALSE, 8);

-- LIVESTOCK FEATURES FOR SHEEP
INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (9, 2, "Body Temperature (°C)", "number", TRUE, 1);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, feature_options, is_required, display_order)
VALUES (10, 2, "Appetite Level", "select", '["Normal", "Reduced", "Poor", "Absent"]', TRUE, 2);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (11, 2, "Symptoms Observed", "text", TRUE, 3);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, feature_options, is_required, display_order)
VALUES (12, 2, "Wool Condition", "select", '["Good", "Poor", "Patchy Loss", "Complete Loss"]', FALSE, 4);

-- LIVESTOCK FEATURES FOR GOATS
INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (13, 3, "Body Temperature (°C)", "number", TRUE, 1);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, feature_options, is_required, display_order)
VALUES (14, 3, "Appetite Level", "select", '["Normal", "Reduced", "Poor", "Absent"]', TRUE, 2);

INSERT INTO livestock_features (feature_id, category_id, feature_name, feature_type, is_required, display_order)
VALUES (15, 3, "Symptoms Observed", "text", TRUE, 3);

-- SAMPLE VET PROFILE
INSERT INTO vet_profiles (vet_profile_id, user_id, license_number, specializations, years_experience, latitude, longitude, address, city, state, country, postal_code, consultation_fee, availability_status, verification_status, verified_by, verified_at)
VALUES (1, 3, "VET2024001", "Large Animals, Cattle Health, Emergency Care", 8, 40.7128, -74.0060, "123 Veterinary Lane", "New York", "NY", "USA", "10001", 150.00, "available", "verified", 1, "2024-01-15 10:00:00");

-- SAMPLE FARMS
INSERT INTO farms (farm_id, farmer_id, farm_name, description, address, city, state, country, postal_code, latitude, longitude, total_area_hectares, farm_type, established_date, is_active)
VALUES (1, 2, "Green Valley Farm", "Main dairy and cattle farm", "Farm Road 123", "Rural Town", "NY", "USA", "12345", 40.7580, -73.9855, 150.00, "livestock", "2018-05-15", TRUE);

INSERT INTO farms (farm_id, farmer_id, farm_name, description, address, city, state, country, postal_code, latitude, longitude, total_area_hectares, farm_type, established_date, is_active)
VALUES (2, 2, "Sunrise Pastures", "Secondary farm for sheep and goats", "Hillside Road 456", "Rural Town", "NY", "USA", "12346", 40.7680, -73.9755, 80.00, "livestock", "2020-03-10", TRUE);

-- SAMPLE LIVESTOCK (now linked to farms)
INSERT INTO livestock (livestock_id, farm_id, category_id, name, tag_number, breed, age_months, weight_kg, gender, birth_date, acquisition_date, current_health_status, notes)
VALUES (1, 1, 1, "Bessie", "GV001", "Holstein", 36, 550.5, "female", "2021-03-15", "2021-03-20", "healthy", "Good milk producer");

INSERT INTO livestock (livestock_id, farm_id, category_id, name, tag_number, breed, age_months, weight_kg, gender, birth_date, acquisition_date, current_health_status, notes)
VALUES (2, 2, 2, "Woolly", "SP001", "Merino", 24, 75.0, "female", "2022-06-10", "2022-06-15", "healthy", "Excellent wool quality");

-- SAMPLE LIVESTOCK FEATURE VALUES
INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value) VALUES (1, 1, "38.5");
INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value) VALUES (1, 4, "Normal");
INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value) VALUES (1, 5, "Normal");
INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value) VALUES (1, 8, "Normal");

INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value) VALUES (2, 9, "39.0");
INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value) VALUES (2, 10, "Normal");
INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value) VALUES (2, 12, "Good");

INSERT INTO password_recovery_requests(shortcode,requested_email,expiry_date,created_at)
VALUES ("321","admin@vvet.com","2020-09-20 12:30:00","2022-01-03 12:30:00");