import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  Download,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';

const PatientView = () => {
  const { user } = useAuth();
  const { getIncidentsByPatient, getPatientById } = useData();
  
  // Get patient data
  const patient = getPatientById(user.patientId);
  const appointments = getIncidentsByPatient(user.patientId || '');
  
  
  // Get upcoming and past appointments
  const now = new Date();
  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) > now
  ).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) <= now || apt.status === 'Completed'
  ).sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const totalCost = appointments
    .filter(apt => apt.status === 'Completed')
    .reduce((sum, apt) => sum + (apt.cost || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dental Records</h1>
        <p className="text-gray-600">View your appointments and treatment history</p>
      </div>

      {/* Patient Info Card */}
      {patient && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User size={20} className="mr-2" />
            Patient Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{patient.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-900">{format(new Date(patient.dob), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Age</label>
                <p className="text-gray-900">{new Date().getFullYear() - new Date(patient.dob).getFullYear()} years</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-900">{patient.contact}</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-900">{patient.email}</span>
              </div>
              {patient.healthInfo && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Health Information</label>
                  <p className="text-gray-900">{patient.healthInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Calendar size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Clock size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                      <p className="text-sm text-gray-600">{appointment.description}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar size={14} className="mr-2" />
                    {format(new Date(appointment.appointmentDate), 'EEEE, MMM dd, yyyy')}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-2" />
                    {format(new Date(appointment.appointmentDate), 'h:mm a')}
                  </div>
                  
                  {appointment.comments && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm text-gray-700">{appointment.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Treatment History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Treatment History</h2>
        </div>
        <div className="p-6">
          {pastAppointments.length > 0 ? (
            <div className="space-y-6">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                      <p className="text-sm text-gray-600">{appointment.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar size={14} className="mr-2" />
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy - h:mm a')}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      {appointment.cost && (
                        <p className="text-sm font-medium text-green-600 mt-2">
                          ${appointment.cost.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {appointment.treatment && (
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-500">Treatment</label>
                      <p className="text-sm text-gray-700">{appointment.treatment}</p>
                    </div>
                  )}

                  {appointment.comments && (
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-500">Comments</label>
                      <p className="text-sm text-gray-700">{appointment.comments}</p>
                    </div>
                  )}

                  {appointment.nextDate && (
                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-500">Next Appointment</label>
                      <p className="text-sm text-gray-700">
                        {format(new Date(appointment.nextDate), 'MMM dd, yyyy - h:mm a')}
                      </p>
                    </div>
                  )}

                  {appointment.files && appointment.files.length > 0 && (
                    <div className="mt-3">
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Attachments</label>
                      <div className="space-y-2">
                        {appointment.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                            <div className="flex items-center">
                              <FileText size={16} className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                            <button
                              onClick={() => downloadFile(file)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Download file"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No treatment history available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientView;
