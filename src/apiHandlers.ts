// apiHandlers.ts
import { Env, Patient, ApiResponse } from './types';

// Helper function to validate patient data
function validatePatient(patient: any): boolean {
  return Boolean(
    patient && 
    patient.first_name && 
    patient.last_name && 
    patient.date_of_birth && 
    patient.gender
  );
}

// Get all patients
export async function getAllPatients(env: Env): Promise<ApiResponse<Patient[]>> {
    try {
      const stmt = env.DB.prepare('SELECT * FROM patients ORDER BY last_name, first_name');
      const { results } = await stmt.all();
      // Fix the type conversion error
      return { 
        success: true, 
        data: results as unknown as Patient[] 
      };
    } catch (error) {
      console.error('Error getting all patients:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

// Get patient by ID
export async function getPatientById(env: Env, id: number): Promise<ApiResponse<Patient>> {
  try {
    // Ensure id is a valid number
    if (typeof id !== 'number' || isNaN(id)) {
      return { success: false, error: 'Invalid patient ID' };
    }
    
    const stmt = env.DB.prepare('SELECT * FROM patients WHERE id = ?');
    const result = await stmt.bind(id).first() as Patient | null;
    
    if (!result) {
      return { success: false, error: 'Patient not found' };
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Create new patient
export async function createPatient(env: Env, patient: Patient): Promise<ApiResponse<Patient>> {
  try {
    if (!validatePatient(patient)) {
      return { success: false, error: 'Required fields missing' };
    }

    const { success } = await env.DB.prepare(`
      INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone, address, medical_condition, last_visit_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      patient.first_name,
      patient.last_name,
      patient.date_of_birth,
      patient.gender,
      patient.email || '',
      patient.phone || '',
      patient.address || '',
      patient.medical_condition || '',
      patient.last_visit_date || ''
    )
    .run();
   
    if (success) {
      // Get the last inserted ID
      const { results } = await env.DB.prepare('SELECT last_insert_rowid() as id').all();
      
      if (results && results.length > 0) {
        const newId = Number(results[0].id);
        
        // Validate newId is a number
        if (typeof newId === 'number' && !isNaN(newId)) {
          // Fetch the newly created patient
          const patientResult = await getPatientById(env, newId);
          
          if (patientResult.success && patientResult.data) {
            return { success: true, data: patientResult.data };
          }
        }
      }
    }
   
    return { success: false, error: 'Failed to create patient' };
  } catch (error) {
    console.error('Error creating patient:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Update patient
export async function updatePatient(env: Env, id: number, patient: Patient): Promise<ApiResponse<Patient>> {
  try {
    // Ensure id is a valid number
    if (typeof id !== 'number' || isNaN(id)) {
      return { success: false, error: 'Invalid patient ID' };
    }
    
    if (!validatePatient(patient)) {
      return { success: false, error: 'Required fields missing' };
    }

    // Check if patient exists
    const existingPatient = await getPatientById(env, id);
   
    if (!existingPatient.success || !existingPatient.data) {
      return { success: false, error: 'Patient not found' };
    }
   
    const { success } = await env.DB.prepare(`
      UPDATE patients SET
        first_name = ?,
        last_name = ?,
        date_of_birth = ?,
        gender = ?,
        email = ?,
        phone = ?,
        address = ?,
        medical_condition = ?,
        last_visit_date = ?
      WHERE id = ?
    `)
    .bind(
      patient.first_name,
      patient.last_name,
      patient.date_of_birth,
      patient.gender,
      patient.email || '',
      patient.phone || '',
      patient.address || '',
      patient.medical_condition || '',
      patient.last_visit_date || '',
      id
    )
    .run();
   
    if (success) {
      // Get the updated patient
      const updatedPatient = await getPatientById(env, id);
     
      if (updatedPatient.success && updatedPatient.data) {
        return { success: true, data: updatedPatient.data };
      }
    }
   
    return { success: false, error: 'Failed to update patient' };
  } catch (error) {
    console.error('Error updating patient:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// Delete patient
export async function deletePatient(env: Env, id: number): Promise<ApiResponse<null>> {
  try {
    // Ensure id is a valid number
    if (typeof id !== 'number' || isNaN(id)) {
      return { success: false, error: 'Invalid patient ID' };
    }
    
    // Check if patient exists
    const existingPatient = await getPatientById(env, id);
   
    if (!existingPatient.success || !existingPatient.data) {
      return { success: false, error: 'Patient not found' };
    }
   
    const { success } = await env.DB.prepare('DELETE FROM patients WHERE id = ?')
      .bind(id)
      .run();
     
    if (success) {
      return { success: true, data: null };
    }
   
    return { success: false, error: 'Failed to delete patient' };
  } catch (error) {
    console.error('Error deleting patient:', error);
    return { success: false, error: 'Internal server error' };
  }
}