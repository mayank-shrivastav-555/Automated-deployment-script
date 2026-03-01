CREATE TABLE IF NOT EXISTS third_party_apis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sequence_number INT,
    api_name VARCHAR(50),
    is_require_otp TINYINT,
    api_end_point VARCHAR(255),
    type VARCHAR(10),
    request_body TINYINT,
    request_body_data TEXT,
    headers TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE third_party_apis ADD CONSTRAINT temp_unique_check UNIQUE (api_name);

INSERT IGNORE INTO third_party_apis (sequence_number, api_name, is_require_otp, api_end_point, type, request_body, request_body_data, headers) VALUES
(1, 'PAN-SUREPASS', 0, 'https://kyc-api.surepass.io/api/v1/pan/pan', 'POST', 1, '{"id_number": "${id}"}', '{"Content-Type": "application/json","Authorization": "Bearer ${process.env.VERIFICATION_TOKEN}"}'),
(1, 'AADHAR', 1, 'https://kyc-api.surepass.io/api/v1/aadhaar-validation/aadhaar-validation', 'POST', 1, '{"id_number": "${id}"}', '{"Content-Type": "application/json","Authorization": "Bearer ${process.env.VERIFICATION_TOKEN}"}'),
(1, 'AADHAR-sendOtp', 0, 'https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp', 'POST', 1, '{"id_number": "${id}"}', '{"Content-Type": "application/json","Authorization": "Bearer ${process.env.VERIFICATION_TOKEN}"}'),
(2, 'AADHAR-verifyOtp', 0, 'https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp', 'POST', 1, '{"id_number": "${id}"}', '{"Content-Type": "application/json","Authorization": "Bearer ${process.env.VERIFICATION_TOKEN}"}'),
(1, 'PAN-ECS-TOKEN', 0, 'https://devuat.offlinekyc.com/OfflineKycHttpWrapper10/ServiceV1', 'POST', 1, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '{"Content-Type": "application/xml","Authorization": "Bearer ${process.env.VERIFICATION_TOKEN}"}'),
(1, 'tokenPAN', 0, 'https://5zl2pwixr72nmw672rhk6o4efa0wlepd.lambda-url.ap-south-1.on.aws/token', 'GET', 0, '', ''),
(1, 'PAN1', 0, 'https://devuat.offlinekyc.com/ECSOVDService/ServiceV1', 'POST', 1, '', '{"Content-Type": "application/json","Authorization": "Bearer ${process.env.VERIFICATION_TOKEN}"}'),
(1, 'ECS-URL1', 0, 'https://qa-cd.deeppulse.org/ECSOVDService/ServiceV1', 'POST', 1, '', ''),
(1, 'PAN', 0, 'https://devuat.offlinekyc.com/ECSOVDService/ServiceV1', 'POST', 1, '', '{"Content-Type": "application/json","Authorization": "Bearer ${process.env.VERIFICATION_TOKEN}"}'),
(1, 'ECS-URL', 0, 'https://devuat.offlinekyc.com/ECSOVDService/ServiceV1', 'POST', 1, '', '');

ALTER TABLE third_party_apis DROP INDEX temp_unique_check;
