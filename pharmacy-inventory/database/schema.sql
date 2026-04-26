-- ============================================================
-- PHARMACY INVENTORY MANAGEMENT SYSTEM
-- PostgreSQL Schema for Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── TABLES ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS medicines (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(150)   NOT NULL,
    generic_name  VARCHAR(150),
    category      VARCHAR(100)   NOT NULL,
    brand         VARCHAR(100),
    dosage        VARCHAR(50),
    unit          VARCHAR(30)    DEFAULT 'tablet',
    quantity      INT            DEFAULT 0,
    reorder_level INT            DEFAULT 10,
    price         NUMERIC(10,2)  NOT NULL DEFAULT 0.00,
    expiry_date   DATE,
    supplier      VARCHAR(150),
    description   TEXT,
    created_at    TIMESTAMPTZ    DEFAULT NOW(),
    updated_at    TIMESTAMPTZ    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id           SERIAL PRIMARY KEY,
    medicine_id  INT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    type         VARCHAR(20) NOT NULL CHECK (type IN ('stock_in','stock_out','adjustment')),
    quantity     INT NOT NULL,
    note         TEXT,
    performed_by VARCHAR(100) DEFAULT 'Admin',
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AUTO-UPDATE updated_at ───────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_medicines_updated_at ON medicines;
CREATE TRIGGER trg_medicines_updated_at
BEFORE UPDATE ON medicines
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── SEED: CATEGORIES ─────────────────────────────────────────

INSERT INTO categories (name, description) VALUES
  ('Antibiotics',           'Medicines that kill or inhibit bacteria'),
  ('Analgesics',            'Pain relievers and antipyretics'),
  ('Antihypertensives',     'Blood pressure lowering medications'),
  ('Vitamins & Supplements','Nutritional supplements and vitamins'),
  ('Antihistamines',        'Allergy and antihistamine medications'),
  ('Antidiabetics',         'Blood sugar controlling medications'),
  ('Antacids',              'Stomach acid reducing medications'),
  ('Cardiovascular',        'Heart and blood vessel medications'),
  ('Respiratory',           'Respiratory tract medications'),
  ('Dermatologicals',       'Skin treatment medications')
ON CONFLICT (name) DO NOTHING;

-- ─── SEED: MEDICINES ──────────────────────────────────────────

INSERT INTO medicines
  (name, generic_name, category, brand, dosage, unit, quantity, reorder_level, price, expiry_date, supplier)
VALUES
  ('Amoxicillin 500mg',   'Amoxicillin',    'Antibiotics',            'Amoxil',     '500mg',  'capsule', 250, 50,  12.50, '2026-08-15', 'PharmaCorp'),
  ('Azithromycin 250mg',  'Azithromycin',   'Antibiotics',            'Zithromax',  '250mg',  'tablet',  120, 30,  45.00, '2026-06-20', 'MediSupply'),
  ('Ciprofloxacin 500mg', 'Ciprofloxacin',  'Antibiotics',            'Cipro',      '500mg',  'tablet',   80, 20,  18.75, '2026-09-10', 'PharmaCorp'),
  ('Paracetamol 500mg',   'Paracetamol',    'Analgesics',             'Biogesic',   '500mg',  'tablet',  500,100,   5.00, '2027-01-30', 'UnitedLabs'),
  ('Ibuprofen 400mg',     'Ibuprofen',      'Analgesics',             'Advil',      '400mg',  'tablet',  350, 80,   8.50, '2026-11-15', 'MediSupply'),
  ('Mefenamic Acid 500mg','Mefenamic Acid', 'Analgesics',             'Ponstan',    '500mg',  'capsule', 200, 50,  10.00, '2026-07-22', 'PharmaCorp'),
  ('Amlodipine 5mg',      'Amlodipine',     'Antihypertensives',      'Norvasc',    '5mg',    'tablet',  180, 40,  22.00, '2027-03-15', 'CardioMed'),
  ('Losartan 50mg',       'Losartan',       'Antihypertensives',      'Cozaar',     '50mg',   'tablet',  150, 40,  28.50, '2026-12-10', 'CardioMed'),
  ('Enalapril 10mg',      'Enalapril',      'Antihypertensives',      'Vasotec',    '10mg',   'tablet',   90, 25,  15.00, '2026-10-05', 'UnitedLabs'),
  ('Vitamin C 500mg',     'Ascorbic Acid',  'Vitamins & Supplements', 'Ceelin',     '500mg',  'tablet',  600,100,   3.50, '2027-06-30', 'NutriPharm'),
  ('Multivitamins',       'Multivitamins',  'Vitamins & Supplements', 'Centrum',    '1 tab',  'tablet',  400, 80,  18.00, '2027-04-15', 'NutriPharm'),
  ('Vitamin B Complex',   'B Complex',      'Vitamins & Supplements', 'Revicon',    '1 tab',  'tablet',  300, 60,  12.00, '2027-02-28', 'NutriPharm'),
  ('Cetirizine 10mg',     'Cetirizine',     'Antihistamines',         'Zyrtec',     '10mg',   'tablet',  220, 50,  14.00, '2026-08-30', 'AllergyMed'),
  ('Loratadine 10mg',     'Loratadine',     'Antihistamines',         'Claritin',   '10mg',   'tablet',  180, 40,  16.50, '2026-09-25', 'AllergyMed'),
  ('Diphenhydramine 25mg','Diphenhydramine','Antihistamines',         'Benadryl',   '25mg',   'capsule',   7, 30,   9.00, '2026-07-15', 'MediSupply'),
  ('Metformin 500mg',     'Metformin',      'Antidiabetics',          'Glucophage', '500mg',  'tablet',  300, 60,  11.00, '2027-01-20', 'DiabeCare'),
  ('Glimepiride 2mg',     'Glimepiride',    'Antidiabetics',          'Amaryl',     '2mg',    'tablet',  120, 30,  35.00, '2026-11-30', 'DiabeCare'),
  ('Omeprazole 20mg',     'Omeprazole',     'Antacids',               'Losec',      '20mg',   'capsule', 280, 60,  20.00, '2026-10-20', 'GastroCare'),
  ('Pantoprazole 40mg',   'Pantoprazole',   'Antacids',               'Protonix',   '40mg',   'tablet',  160, 40,  25.00, '2026-12-05', 'GastroCare'),
  ('Atorvastatin 20mg',   'Atorvastatin',   'Cardiovascular',         'Lipitor',    '20mg',   'tablet',  200, 50,  32.00, '2027-05-10', 'CardioMed'),
  ('Aspirin 80mg',        'Aspirin',        'Cardiovascular',         'Cartia',     '80mg',   'tablet',  450,100,   4.50, '2027-08-15', 'UnitedLabs'),
  ('Salbutamol 100mcg',   'Salbutamol',     'Respiratory',            'Ventolin',   '100mcg', 'inhaler',   5, 15, 280.00, '2026-06-30', 'RespiraMed'),
  ('Montelukast 10mg',    'Montelukast',    'Respiratory',            'Singulair',  '10mg',   'tablet',   95, 25,  55.00, '2026-09-15', 'RespiraMed'),
  ('Clotrimazole 1%',     'Clotrimazole',   'Dermatologicals',        'Canesten',   '1%',     'cream',    60, 15, 120.00, '2027-03-20', 'DermaCare'),
  ('Hydrocortisone 1%',   'Hydrocortisone', 'Dermatologicals',        'Cortaid',    '1%',     'cream',    45, 10,  85.00, '2026-11-25', 'DermaCare');

-- ─── SEED: SAMPLE TRANSACTIONS ────────────────────────────────

INSERT INTO transactions (medicine_id, type, quantity, note, performed_by)
SELECT id,  'stock_in', 100, 'Initial stock', 'Admin'      FROM medicines WHERE name = 'Amoxicillin 500mg';
INSERT INTO transactions (medicine_id, type, quantity, note, performed_by)
SELECT id,  'stock_in', 200, 'Initial stock', 'Admin'      FROM medicines WHERE name = 'Paracetamol 500mg';
INSERT INTO transactions (medicine_id, type, quantity, note, performed_by)
SELECT id, 'stock_out',  50, 'Sold to patient','Pharmacist' FROM medicines WHERE name = 'Paracetamol 500mg';
INSERT INTO transactions (medicine_id, type, quantity, note, performed_by)
SELECT id,  'stock_in', 300, 'Monthly restock','Admin'     FROM medicines WHERE name = 'Vitamin C 500mg';
INSERT INTO transactions (medicine_id, type, quantity, note, performed_by)
SELECT id, 'stock_out',   3, 'Dispensed',      'Pharmacist' FROM medicines WHERE name = 'Salbutamol 100mcg';
INSERT INTO transactions (medicine_id, type, quantity, note, performed_by)
SELECT id, 'stock_out',  23, 'Sold',           'Pharmacist' FROM medicines WHERE name = 'Diphenhydramine 25mg';
