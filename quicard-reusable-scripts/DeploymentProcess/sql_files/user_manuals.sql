CREATE TABLE IF NOT EXISTS user_manuals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(10),
    document_filepath VARCHAR(255),
    document_file_name VARCHAR(255),
    user_type VARCHAR(50),
    is_active TINYINT,
    created_by INT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE user_manuals ADD CONSTRAINT temp_unique_check UNIQUE (document_file_name);

INSERT IGNORE INTO user_manuals (version, document_filepath, document_file_name, user_type, is_active, created_by, updated_by) VALUES
('1.0', 'userManual/User Manual - Enterprise.pdf', 'User Manual - Enterprise.pdf', 'Enterprise', 1, 1, 1),
('1.0', 'userManual/User Manual - Partner.pdf', 'User Manual - Partner.pdf', 'Partner', 1, 1, 1),
('1.0', 'userManual/User Manual - Individual.pdf', 'User Manual - Individual.pdf', 'Individual', 1, 1, 1);

ALTER TABLE user_manuals DROP INDEX temp_unique_check;
