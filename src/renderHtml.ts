export function renderHtml(patients: any) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Patient Lab Management</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.10.3/cdn.min.js" defer></script>
      </head>
   
      <body class="bg-gray-100">
        <div x-data="patientApp()" class="min-h-screen">
          <header class="bg-blue-600 shadow-md">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h1 class="text-3xl font-bold text-white">Patient Lab Management</h1>
              </div>
              <button @click="showAddModal = true" class="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Add New Patient
              </button>
            </div>
          </header>

          <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div class="mb-6 flex justify-between items-center">
              <h2 class="text-2xl font-semibold text-gray-800">Patient Records</h2>
              <div class="relative">
                <input 
                  type="text" 
                  placeholder="Search patients..." 
                  x-model="searchTerm"
                  class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div class="bg-white shadow overflow-hidden rounded-lg">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Condition</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <template x-for="patient in filteredPatients" :key="patient.id">
                      <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span class="text-blue-600 font-medium" x-text="patient.first_name.charAt(0) + patient.last_name.charAt(0)"></span>
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900" x-text="patient.first_name + ' ' + patient.last_name"></div>
                              <div class="text-sm text-gray-500" x-text="patient.gender"></div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" x-text="patient.date_of_birth"></td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900" x-text="patient.email"></div>
                          <div class="text-sm text-gray-500" x-text="patient.phone"></div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" x-text="patient.medical_condition"></span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" x-text="patient.last_visit_date"></td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button @click="editPatient(patient)" class="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
                          <button @click="deletePatient(patient.id)" class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          <!-- Add Patient Modal -->
          <div x-show="showAddModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div x-show="showAddModal" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div x-show="showAddModal" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100" x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-medium text-gray-900" x-text="editMode ? 'Edit Patient' : 'Add New Patient'"></h3>
                      <div class="mt-4 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                        <div>
                          <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
                          <input type="text" name="first_name" id="first_name" x-model="currentPatient.first_name" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <div>
                          <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
                          <input type="text" name="last_name" id="last_name" x-model="currentPatient.last_name" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <div>
                          <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
                          <input type="date" name="date_of_birth" id="date_of_birth" x-model="currentPatient.date_of_birth" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <div>
                          <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                          <select name="gender" id="gender" x-model="currentPatient.gender" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                          <input type="email" name="email" id="email" x-model="currentPatient.email" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <div>
                          <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                          <input type="text" name="phone" id="phone" x-model="currentPatient.phone" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <div class="sm:col-span-2">
                          <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                          <input type="text" name="address" id="address" x-model="currentPatient.address" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <div class="sm:col-span-2">
                          <label for="medical_condition" class="block text-sm font-medium text-gray-700">Medical Condition</label>
                          <input type="text" name="medical_condition" id="medical_condition" x-model="currentPatient.medical_condition" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                        <div>
                          <label for="last_visit_date" class="block text-sm font-medium text-gray-700">Last Visit Date</label>
                          <input type="date" name="last_visit_date" id="last_visit_date" x-model="currentPatient.last_visit_date" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" @click="savePatient()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Save
                  </button>
                  <button type="button" @click="showAddModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Delete Confirmation Modal -->
          <div x-show="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div x-show="showDeleteModal" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div x-show="showDeleteModal" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100" x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Patient</h3>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">Are you sure you want to delete this patient record? This action cannot be undone.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" @click="confirmDelete()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Delete
                  </button>
                  <button type="button" @click="showDeleteModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <script>
          function patientApp() {
            return {
              patients: ${patients},
              showAddModal: false,
              showDeleteModal: false,
              editMode: false,
              deletePatientId: null,
              searchTerm: '',
              currentPatient: {
                id: null,
                first_name: '',
                last_name: '',
                date_of_birth: '',
                gender: '',
                email: '',
                phone: '',
                address: '',
                medical_condition: '',
                last_visit_date: ''
              },
              get filteredPatients() {
                if (!this.searchTerm) return this.patients;
                const term = this.searchTerm.toLowerCase();
                return this.patients.filter(patient => 
                  patient.first_name.toLowerCase().includes(term) || 
                  patient.last_name.toLowerCase().includes(term) ||
                  patient.medical_condition.toLowerCase().includes(term) ||
                  patient.email.toLowerCase().includes(term)
                );
              },
              editPatient(patient) {
                this.editMode = true;
                this.currentPatient = {...patient};
                this.showAddModal = true;
              },
              savePatient() {
                const method = this.editMode ? 'PUT' : 'POST';
                const url = this.editMode ? \`/api/patients/\${this.currentPatient.id}\` : '/api/patients';
                
                fetch(url, {
                  method: method,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(this.currentPatient)
                })
                .then(response => response.json())
                .then(data => {
                  if (this.editMode) {
                    const index = this.patients.findIndex(p => p.id === this.currentPatient.id);
                    if (index !== -1) {
                      this.patients[index] = data;
                    }
                  } else {
                    this.patients.push(data);
                  }
                  
                  this.showAddModal = false;
                  this.resetForm();
                })
                .catch(error => {
                  console.error('Error saving patient:', error);
                  alert('An error occurred while saving the patient data.');
                });
              },
              deletePatient(id) {
                this.deletePatientId = id;
                this.showDeleteModal = true;
              },
              confirmDelete() {
                if (!this.deletePatientId) return;
                
                fetch(\`/api/patients/\${this.deletePatientId}\`, {
                  method: 'DELETE'
                })
                .then(response => {
                  if (response.ok) {
                    this.patients = this.patients.filter(p => p.id !== this.deletePatientId);
                    this.showDeleteModal = false;
                    this.deletePatientId = null;
                  } else {
                    throw new Error('Failed to delete patient');
                  }
                })
                .catch(error => {
                  console.error('Error deleting patient:', error);
                  alert('An error occurred while deleting the patient.');
                });
              },
              resetForm() {
                this.currentPatient = {
                  id: null,
                  first_name: '',
                  last_name: '',
                  date_of_birth: '',
                  gender: '',
                  email: '',
                  phone: '',
                  address: '',
                  medical_condition: '',
                  last_visit_date: ''
                };
                this.editMode = false;
              }
            }
          }
        </script>
      </body>
    </html>
  `;

}