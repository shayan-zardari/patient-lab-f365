// index.ts
import { renderHtml } from "./renderHtml";
import { Env, Patient } from './types';
import { 
  getAllPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deletePatient 
} from './apiHandlers';

// Helper function to parse request body
async function parseJsonBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch (err) {
    return null;
  }
}
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // API Routes
    if (path.startsWith('/api/patients')) {
      // Get patient by ID: GET /api/patients/{id}
      if (path.match(/^\/api\/patients\/\d+$/) && method === 'GET') {
        const id = parseInt(path.split('/').pop() || '0');
        const result = await getPatientById(env, id);
        
        if (!result.success) {
          return new Response(JSON.stringify({ error: result.error }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify(result.data), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Get all patients: GET /api/patients
      if (path === '/api/patients' && method === 'GET') {
        const result = await getAllPatients(env);
        
        if (!result.success) {
          return new Response(JSON.stringify({ error: result.error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify(result.data), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Create new patient: POST /api/patients
      if (path === '/api/patients' && method === 'POST') {
        const patientData = await parseJsonBody(request);
        
        if (!patientData) {
          return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const result = await createPatient(env, patientData as Patient);
        
        if (!result.success) {
          return new Response(JSON.stringify({ error: result.error }), {
            status: result.error === 'Required fields missing' ? 400 : 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify(result.data), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Update patient: PUT /api/patients/{id}
      if (path.match(/^\/api\/patients\/\d+$/) && method === 'PUT') {
        const id = parseInt(path.split('/').pop() || '0');
        const patientData = await parseJsonBody(request);
        
        if (!patientData) {
          return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const result = await updatePatient(env, id, patientData as Patient);
        
        if (!result.success) {
          const status = result.error === 'Patient not found' ? 404 : 
                         result.error === 'Required fields missing' ? 400 : 500;
                         
          return new Response(JSON.stringify({ error: result.error }), {
            status,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify(result.data), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Delete patient: DELETE /api/patients/{id}
      if (path.match(/^\/api\/patients\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/').pop() || '0');
        const result = await deletePatient(env, id);
        
        if (!result.success) {
          const status = result.error === 'Patient not found' ? 404 : 500;
          
          return new Response(JSON.stringify({ error: result.error }), {
            status,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // If none of the API routes match
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Main HTML route - render patient UI
    if (path === '/' || path === '') {
      const result = await getAllPatients(env);
      
      if (!result.success) {
        return new Response('Error loading patients', { status: 500 });
      }
      
      return new Response(renderHtml(JSON.stringify(result.data, null, 2)), {
        headers: {
          'content-type': 'text/html',
        },
      });
    }
    
    // Handle 404 for any other routes
    return new Response('Not Found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
