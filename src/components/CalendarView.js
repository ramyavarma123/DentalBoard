import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const CalendarView = () => {
  const { incidents, getPatientById } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getAppointmentsForDate = (date) => {
    return incidents.filter(incident => 
      incident.appointmentDate && 
      isSameDay(new Date(incident.appointmentDate), date)
    );
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const getDayClass = (day) => {
    let classes = "min-h-32 p-2 border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ";
    
    if (!isSameMonth(day, currentDate)) {
      classes += "bg-gray-100 text-gray-400 ";
    } else {
      classes += "bg-white text-gray-900 ";
    }
    
    if (isSameDay(day, new Date())) {
      classes += "bg-blue-50 border-blue-200 ";
    }
    
    if (selectedDate && isSameDay(day, selectedDate)) {
      classes += "bg-blue-100 border-blue-300 ";
    }
    
    return classes;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'In Progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600">View and manage appointments by date</p>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-lg font-semibold text-gray-900 min-w-48 text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 table-header">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map(day => {
                const dayAppointments = getAppointmentsForDate(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={getDayClass(day)}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'}`}>
                        {format(day, 'd')}
                      </span>
                      {dayAppointments.length > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>
                    
                    {/* Appointment dots */}
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map(appointment => (
                        <div
                          key={appointment.id}
                          className="text-xs p-1 rounded text-white truncate"
                          style={{ backgroundColor: getStatusColor(appointment.status).replace('bg-', '#').replace('-500', '') }}
                          title={`${appointment.title} - ${getPatientById(appointment.patientId)?.name}`}
                        >
                          {format(new Date(appointment.appointmentDate), 'HH:mm')} {appointment.title}
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Appointment Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon size={20} className="mr-2" />
              {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a date'}
            </h3>
            
            {selectedDate ? (
              selectedDateAppointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateAppointments.map(appointment => {
                    const patient = getPatientById(appointment.patientId);
                    return (
                      <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User size={14} className="mr-2" />
                            {patient?.name || 'Unknown Patient'}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-2" />
                            {format(new Date(appointment.appointmentDate), 'h:mm a')}
                          </div>
                          {appointment.cost && (
                            <div className="text-green-600 font-medium">
                              ${appointment.cost.toFixed(2)}
                            </div>
                          )}
                        </div>
                        
                        {appointment.description && (
                          <p className="text-xs text-gray-500 mt-2">
                            {appointment.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No appointments scheduled for this date.</p>
              )
            ) : (
              <p className="text-gray-500 text-sm">Click on a date to view appointments.</p>
            )}
          </div>

          {/* Legend */}
          <div className="card p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm text-gray-700">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
