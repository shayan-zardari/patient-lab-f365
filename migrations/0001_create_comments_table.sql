CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    gender TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    medical_condition TEXT,
    last_visit_date TEXT
);

-- Insert mock patient data
INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone, address, medical_condition, last_visit_date)
VALUES
    ('John', 'Smith', '1985-03-15', 'Male', 'john.smith@email.com', '(555) 123-4567', '123 Main St, Anytown, USA', 'Hypertension', '2023-11-20'),
    ('Emily', 'Johnson', '1992-07-22', 'Female', 'emily.j@email.com', '(555) 234-5678', '456 Oak Ave, Somewhere, USA', 'Asthma', '2024-01-15'),
    ('Michael', 'Williams', '1978-11-30', 'Male', 'mwilliams@email.com', '(555) 345-6789', '789 Pine Rd, Elsewhere, USA', 'Diabetes Type 2', '2023-12-05'),
    ('Sarah', 'Davis', '1990-05-10', 'Female', 'sarah.davis@email.com', '(555) 456-7890', '101 Elm St, Nowhere, USA', 'Migraine', '2024-02-28'),
    ('Robert', 'Brown', '1965-09-03', 'Male', 'rbrown@email.com', '(555) 567-8901', '202 Maple Dr, Anyplace, USA', 'Arthritis', '2024-03-10')
;