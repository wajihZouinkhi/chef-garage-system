'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Wrench, Users, Calendar } from 'lucide-react';
import { getBrandLogo } from '@/lib/vehicle-brands';
import axios from 'axios';

export default function ViewerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [staff, setStaff] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [vehiclesRes, maintenanceRes, staffRes] = await Promise.all([
        axios.get('http://localhost:3001/vehicles', { headers }),
        axios.get('http://localhost:3001/maintenance', { headers }),
        axios.get('http://localhost:3001/staff', { headers })
      ]);

      setVehicles(vehiclesRes.data);
      setMaintenanceLogs(maintenanceRes.data);
      setStaff(staffRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Calculate analytics
  const recentMaintenance = maintenanceLogs.filter((log: any) => {
    const logDate = new Date(log.dateFrom || log.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return logDate >= thirtyDaysAgo;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Navbar for Viewer */}
      <nav className="bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-10 w-10 sm:h-14 sm:w-14 flex items-center justify-center">
                <img
                  src="/logo.svg"
                  alt="LA JOIE DE HICHA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm sm:text-xl font-bold text-green-700">LA JOIE DE HICHA</h1>
                <p className="text-xs text-gray-500">Viewer Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                router.push('/login');
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Analytics Overview</h2>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
              <p className="text-xs text-gray-500 mt-1">All registered vehicles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceLogs.length}</div>
              <p className="text-xs text-gray-500 mt-1">All maintenance records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent (30 days)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentMaintenance.length}</div>
              <p className="text-xs text-gray-500 mt-1">Last month activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
              <p className="text-xs text-gray-500 mt-1">Active mechanics</p>
            </CardContent>
          </Card>
        </div>

        {/* Complete Maintenance History */}
        <div className="mb-8">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Complete Maintenance History</h3>
          
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {maintenanceLogs.map((log: any) => {
              let vehicleId = log.vehicleId;
              if (typeof vehicleId === 'object' && vehicleId._id) {
                vehicleId = vehicleId._id;
              }
              
              const vehicle: any = vehicles.find((v: any) => String(v._id) === String(vehicleId));
              
              let dateDisplay = '';
              if (log.dateType === 'range' && log.dateFrom && log.dateTo) {
                dateDisplay = `${new Date(log.dateFrom).toLocaleDateString()} - ${new Date(log.dateTo).toLocaleDateString()}`;
              } else if (log.dateFrom) {
                dateDisplay = new Date(log.dateFrom).toLocaleDateString();
              } else if (log.date) {
                dateDisplay = new Date(log.date).toLocaleDateString();
              }
              
              return (
                <Card 
                  key={log._id}
                  className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-green-500"
                  onClick={() => vehicle && router.push(`/vehicles/${vehicle._id}/history`)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const brandLogo = getBrandLogo(vehicle?.make || '');
                          return brandLogo ? (
                            <img 
                              src={brandLogo} 
                              alt={`${vehicle?.make} logo`}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null;
                        })()}
                        <span className="font-semibold text-sm">{vehicle?.make || '-'}</span>
                      </div>
                      <span className="text-xs text-gray-500">{dateDisplay}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{vehicle?.matriculation || 'Unknown'}</p>
                      <p className="text-xs text-gray-600">{vehicle?.vinSerial || '-'}</p>
                    </div>
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium">{log.title}</p>
                      <p className="text-xs text-gray-600">by {log.mechanicName}</p>
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      Tap to view details →
                    </div>
                  </div>
                </Card>
              );
            })}
            {maintenanceLogs.length === 0 && (
              <Card className="p-8 text-center text-gray-500">
                <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm">No maintenance records yet</p>
              </Card>
            )}
          </div>
          
          {/* Desktop Table View */}
          <Card className="hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="h-12 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm">Serial Number</th>
                    <th className="h-12 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm">Brand</th>
                    <th className="h-12 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm">Matriculation</th>
                    <th className="h-12 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm">Service</th>
                    <th className="h-12 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm">Mechanic</th>
                    <th className="h-12 px-3 sm:px-4 text-left font-medium text-xs sm:text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceLogs.map((log: any) => {
                    let vehicleId = log.vehicleId;
                    if (typeof vehicleId === 'object' && vehicleId._id) {
                      vehicleId = vehicleId._id;
                    }
                    
                    const vehicle: any = vehicles.find((v: any) => String(v._id) === String(vehicleId));
                    
                    let dateDisplay = '';
                    if (log.dateType === 'range' && log.dateFrom && log.dateTo) {
                      dateDisplay = `${new Date(log.dateFrom).toLocaleDateString()} - ${new Date(log.dateTo).toLocaleDateString()}`;
                    } else if (log.dateFrom) {
                      dateDisplay = new Date(log.dateFrom).toLocaleDateString();
                    } else if (log.date) {
                      dateDisplay = new Date(log.date).toLocaleDateString();
                    }
                    
                    return (
                      <tr 
                        key={log._id} 
                        className="border-b hover:bg-green-50 cursor-pointer transition-colors"
                        onClick={() => vehicle && router.push(`/vehicles/${vehicle._id}/history`)}
                      >
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
                          {vehicle?.vinSerial || '-'}
                        </td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const brandLogo = getBrandLogo(vehicle?.make || '');
                              return brandLogo ? (
                                <img 
                                  src={brandLogo} 
                                  alt={`${vehicle?.make} logo`}
                                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : null;
                            })()}
                            <span>{vehicle?.make || '-'}</span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 font-medium text-xs sm:text-sm">
                          {vehicle?.matriculation || 'Unknown'}
                        </td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm">{log.title}</td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm">{log.mechanicName}</td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm whitespace-nowrap">{dateDisplay}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {maintenanceLogs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p>No maintenance records yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Vehicles List */}
        <div className="mb-8">
          <h3 className="text-lg sm:text-xl font-bold mb-4">All Vehicles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {vehicles.map((vehicle: any) => (
              <Card 
                key={vehicle._id} 
                className="hover:shadow-lg transition-all cursor-pointer hover:border-green-500"
                onClick={() => router.push(`/vehicles/${vehicle._id}/history`)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg break-all">{vehicle.matriculation}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Brand:</span>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const brandLogo = getBrandLogo(vehicle.make || '');
                          return brandLogo ? (
                            <img 
                              src={brandLogo} 
                              alt={`${vehicle.make} logo`}
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : null;
                        })()}
                        <span className="font-medium">{vehicle.make || '-'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{vehicle.model || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serial:</span>
                      <span className="font-medium text-xs break-all">{vehicle.vinSerial || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{vehicle.type}</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 text-xs text-green-600 font-medium">
                    Tap to view history →
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Staff List */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-4">Staff Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {staff.map((member: any) => (
              <Card key={member._id}>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="space-y-2">
                    <h4 className="font-bold text-base sm:text-lg">{member.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{member.position}</p>
                    {member.phone && (
                      <p className="text-xs sm:text-sm text-gray-500">{member.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {staff.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center text-gray-500">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm">No staff members yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
