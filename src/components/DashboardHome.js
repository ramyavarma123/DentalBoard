import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock,
  TrendingUp 
} from 'lucide-react';
import { format } from 'date-fns';

const DashboardHome = () => {
  const { 
    patients, 
    getUpcomingAppointments, 
    getTotalRevenue, 
    getCompletedTreatments, 
    getPendingTreatments,
    getTopPatients,
    getPatientById
  } = useData();

  const upcomingAppointments = getUpcomingAppointments();
  const totalRevenue = getTotalRevenue();
  const completedTreatments = getCompletedTreatments();
  const pendingTreatments = getPendingTreatments();
  const topPatients = getTopPatients();

  const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
<div className="card p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your dental center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-purple-500"
        />
        <StatCard
          title="Completed Treatments"
          value={completedTreatments.length}
          icon={CheckCircle}
          color="bg-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Next 10 Appointments</h2>
          </div>
          <div className="p-6">
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 10).map((appointment) => {
                  const patient = getPatientById(appointment.patientId);
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{patient?.name}</p>
                        <p className="text-sm text-gray-600">{appointment.title}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy - h:mm a')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </div>

        {/* Top Patients */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Patients by Revenue</h2>
          </div>
          <div className="p-6">
            {topPatients.length > 0 ? (
              <div className="space-y-4">
                {topPatients.map(({ patient, totalCost }, index) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${totalCost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No patient data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Treatment Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Treatment Status Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{completedTreatments.length}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{pendingTreatments.length}</p>
              <p className="text-sm text-gray-600">Pending/In Progress</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ${(totalRevenue / (completedTreatments.length || 1)).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Avg Revenue per Treatment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
