import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const defaultData = {
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      email: "john@entnt.in",
      address: "123 Main St, City, State",
      healthInfo: "No allergies",
      emergencyContact: "Jane Doe - 0987654321"
    },
    {
      id: "p2",
      name: "Sarah Johnson",
      dob: "1985-08-22",
      contact: "2345678901",
      email: "sarah@entnt.in",
      address: "456 Oak Ave, City, State",
      healthInfo: "Allergic to penicillin",
      emergencyContact: "Mike Johnson - 1234567890"
    }
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Routine Cleaning",
      description: "Regular dental cleaning and checkup",
      comments: "Good oral hygiene maintained",
      appointmentDate: "2025-07-01T10:00:00",
      cost: 80,
      treatment: "Professional cleaning, fluoride treatment",
      status: "Completed",
      nextDate: "2026-01-01T10:00:00",
      files: []
    },
    {
      id: "i2",
      patientId: "p1",
      title: "Tooth Filling",
      description: "Cavity filling on upper molar",
      comments: "Patient tolerated procedure well",
      appointmentDate: "2025-07-15T14:00:00",
      cost: 150,
      treatment: "Composite filling",
      status: "Pending",
      nextDate: null,
      files: []
    },
    {
      id: "i3",
      patientId: "p2",
      title: "Root Canal",
      description: "Root canal treatment on lower premolar",
      comments: "Multiple sessions required",
      appointmentDate: "2025-06-30T09:00:00",
      cost: 500,
      treatment: "Root canal therapy - Session 1",
      status: "In Progress",
      nextDate: "2025-08-01T09:00:00",
      files: []
    }
  ]
};

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    // Initialize data from localStorage or use default data
    const savedPatients = localStorage.getItem('dentalPatients');
    const savedIncidents = localStorage.getItem('dentalIncidents');

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    } else {
      setPatients(defaultData.patients);
      localStorage.setItem('dentalPatients', JSON.stringify(defaultData.patients));
    }

    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents));
    } else {
      setIncidents(defaultData.incidents);
      localStorage.setItem('dentalIncidents', JSON.stringify(defaultData.incidents));
    }
  }, []);

  // Patient management functions
  const addPatient = (patient) => {
    const newPatient = {
      ...patient,
      id: 'p' + Date.now()
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    localStorage.setItem('dentalPatients', JSON.stringify(updatedPatients));
    return newPatient;
  };

  const updatePatient = (patientId, updatedData) => {
    const updatedPatients = patients.map(p => 
      p.id === patientId ? { ...p, ...updatedData } : p
    );
    setPatients(updatedPatients);
    localStorage.setItem('dentalPatients', JSON.stringify(updatedPatients));
  };

  const deletePatient = (patientId) => {
    const updatedPatients = patients.filter(p => p.id !== patientId);
    const updatedIncidents = incidents.filter(i => i.patientId !== patientId);
    
    setPatients(updatedPatients);
    setIncidents(updatedIncidents);
    localStorage.setItem('dentalPatients', JSON.stringify(updatedPatients));
    localStorage.setItem('dentalIncidents', JSON.stringify(updatedIncidents));
  };

  const getPatientById = (patientId) => {
    return patients.find(p => p.id === patientId);
  };

  // Incident management functions
  const addIncident = (incident) => {
    const newIncident = {
      ...incident,
      id: 'i' + Date.now(),
      files: incident.files || []
    };
    const updatedIncidents = [...incidents, newIncident];
    setIncidents(updatedIncidents);
    localStorage.setItem('dentalIncidents', JSON.stringify(updatedIncidents));
    return newIncident;
  };

  const updateIncident = (incidentId, updatedData) => {
    const updatedIncidents = incidents.map(i => 
      i.id === incidentId ? { ...i, ...updatedData } : i
    );
    setIncidents(updatedIncidents);
    localStorage.setItem('dentalIncidents', JSON.stringify(updatedIncidents));
  };

  const deleteIncident = (incidentId) => {
    const updatedIncidents = incidents.filter(i => i.id !== incidentId);
    setIncidents(updatedIncidents);
    localStorage.setItem('dentalIncidents', JSON.stringify(updatedIncidents));
  };

  const getIncidentsByPatient = (patientId) => {
    return incidents.filter(i => i.patientId === patientId);
  };

  const getUpcomingAppointments = (limit = 10) => {
    const now = new Date();
    return incidents
      .filter(i => new Date(i.appointmentDate) > now)
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, limit);
  };

  const getCompletedTreatments = () => {
    return incidents.filter(i => i.status === 'Completed');
  };

  const getPendingTreatments = () => {
    return incidents.filter(i => i.status === 'Pending' || i.status === 'In Progress');
  };

  const getTotalRevenue = () => {
    return incidents
      .filter(i => i.status === 'Completed')
      .reduce((total, i) => total + (i.cost || 0), 0);
  };

  const getTopPatients = (limit = 5) => {
    const patientCosts = {};
    incidents.forEach(i => {
      if (i.status === 'Completed') {
        patientCosts[i.patientId] = (patientCosts[i.patientId] || 0) + (i.cost || 0);
      }
    });

    return Object.entries(patientCosts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([patientId, totalCost]) => ({
        patient: getPatientById(patientId),
        totalCost
      }))
      .filter(item => item.patient);
  };

  const value = {
    patients,
    incidents,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    addIncident,
    updateIncident,
    deleteIncident,
    getIncidentsByPatient,
    getUpcomingAppointments,
    getCompletedTreatments,
    getPendingTreatments,
    getTotalRevenue,
    getTopPatients
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
