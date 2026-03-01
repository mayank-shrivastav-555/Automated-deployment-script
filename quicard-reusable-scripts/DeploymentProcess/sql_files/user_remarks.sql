CREATE TABLE IF NOT EXISTS remarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    remark TEXT,
    user_type VARCHAR(50),
    remark_type VARCHAR(50),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE remarks ADD CONSTRAINT temp_unique_check UNIQUE (remark(255));

INSERT IGNORE INTO remarks (remark, user_type, remark_type, created_by) VALUES
('I do not wish to share.', 'Individual', 'consent_reject', 0),
('Extra information requested.', 'Individual', 'consent_reject', 0),
('Request not valid.', 'Individual', 'consent_reject', 0),
('I do not recognise this request.', 'Individual', 'consent_reject', 0),
('Other reason.', 'Individual', 'consent_reject', 0),
('Details verified and approved.', 'Maker', 'bgv_status_close', 0),
('Documents verified and approved.', 'Maker', 'bgv_status_close', 0),
('Unable to verify details/documents.', 'Maker', 'bgv_status_close', 0),
('Additional remark – This is not mandatory.', 'Maker', 'bgv_status_close', 0),
('Details mismatch – Verification negative.', 'Maker', 'bgv_status_close', 0),
('Other reason.', 'Maker', 'bgv_status_close', 0),
('Background verification required for employment.', 'Enterprise', 'initiate_request', 0),
('Periodic verification.', 'Enterprise', 'initiate_request', 0),
('Additional check/s required for the assignment.', 'Enterprise', 'initiate_request', 0),
('Customer identity verification.', 'Enterprise', 'initiate_request', 0),
('Other reason.', 'Enterprise', 'initiate_request', 0),
('No longer in need of verification', 'Enterprise', 'withdrawn_request', 0),
('Withdrawn as per the candidate request.', 'Enterprise', 'withdrawn_request', 0),
('Other reason.', 'Enterprise', 'withdrawn_request', 0),
('No longer in need of verification', 'Enterprise', 'reverification_request', 0),
('Employment discontinuation', 'Enterprise', 'reverification_request', 0),
('Other reason.', 'Enterprise', 'reverification_request', 0);

ALTER TABLE remarks DROP INDEX temp_unique_check;