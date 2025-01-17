// Simulating API calls with localStorage for persistence

const STORAGE_KEY = 'medical_dashboard_data';

const initialData = {
    patients: [
        { id: 1, name: 'John Doe', dob: '1980-05-15', gender: 'Male' },
        { id: 2, name: 'Jane Smith', dob: '1992-08-22', gender: 'Female' },
        { id: 3, name: 'Mike Johnson', dob: '1975-11-30', gender: 'Male' },
    ],
    appointments: [
        { id: 1, patientId: 1, date: '2025-01-15', time: '09:00', type: 'General Checkup', status: 'Pending' },
        { id: 2, patientId: 2, date: '2025-01-15', time: '10:30', type: 'Follow-up', status: 'Approved' },
        { id: 3, patientId: 3, date: '2025-01-15', time: '14:00', type: 'Consultation', status: 'Pending' },
    ],
    medicalRecords: [
        { id: 1, patientId: 1, date: '2024-12-01', diagnosis: 'Hypertension', treatment: 'Prescribed ACE inhibitors' },
        { id: 2, patientId: 2, date: '2024-12-05', diagnosis: 'Migraine', treatment: 'Prescribed triptans' },
        { id: 3, patientId: 1, date: '2024-12-10', diagnosis: 'Common Cold', treatment: 'Rest and fluids recommended' },
    ],
    prescriptions: [
        { id: 1, patientId: 1, medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
        { id: 2, patientId: 2, medication: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '30 days' },
        { id: 3, patientId: 1, medication: 'Acetaminophen', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days' },
    ],
};

// Initialize localStorage with mock data if it doesn't exist
if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

// Helper function to get data from localStorage
const getData = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

// Helper function to save data to localStorage
const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const api = {
    getPatients: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getData().patients);
            }, 300);
        });
    },

    getAppointments: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getData().appointments);
            }, 300);
        });
    },

    updateAppointmentStatus: (id, status) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = getData();
                const appointment = data.appointments.find(a => a.id === id);
                if (appointment) {
                    appointment.status = status;
                    saveData(data);
                    resolve(appointment);
                } else {
                    resolve(null);
                }
            }, 300);
        });
    },

    getMedicalRecords: (patientId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const records = getData().medicalRecords.filter(r => r.patientId === patientId);
                resolve(records);
            }, 300);
        });
    },

    addMedicalRecord: (record) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = getData();
                const newRecord = { ...record, id: Date.now() };
                data.medicalRecords.push(newRecord);
                saveData(data);
                resolve(newRecord);
            }, 300);
        });
    },

    getPrescriptions: (patientId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const prescriptions = getData().prescriptions.filter(p => p.patientId === patientId);
                resolve(prescriptions);
            }, 300);
        });
    },

    addPrescription: (prescription) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = getData();
                const newPrescription = { ...prescription, id: Date.now() };
                data.prescriptions.push(newPrescription);
                saveData(data);
                resolve(newPrescription);
            }, 300);
        });
    },
};

