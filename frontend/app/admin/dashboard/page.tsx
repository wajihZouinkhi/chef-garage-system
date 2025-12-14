'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Wrench, DollarSign, Users } from 'lucide-react';
import axios from 'axios';
import { Navbar } from '@/components/navbar';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [staff, setStaff] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Redirect viewers to their dashboard
    if (role !== 'admin') {
      router.push('/dashboard');
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
      
      // Debug: Log the data to help troubleshoot
      console.log('Vehicles:', vehiclesRes.data);
      console.log('Maintenance Logs:', maintenanceRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const totalCost = maintenanceLogs.reduce((sum: number, log: any) => sum + log.cost, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="dashboard" />

      <main className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Dashboard</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Records</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maintenanceLogs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-4">Recent Maintenance</h3>
          <Card>
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
                  {maintenanceLogs.slice(0, 10).map((log: any) => {
                    // Handle both ObjectId and populated vehicle object
                    let vehicleId = log.vehicleId;
                    if (typeof vehicleId === 'object' && vehicleId._id) {
                      vehicleId = vehicleId._id;
                    }
                    
                    // Convert both IDs to strings for comparison
                    const vehicle: any = vehicles.find((v: any) => String(v._id) === String(vehicleId));
                    
                    // Format date properly
                    let dateDisplay = '';
                    if (log.dateType === 'range' && log.dateFrom && log.dateTo) {
                      dateDisplay = `${new Date(log.dateFrom).toLocaleDateString()} - ${new Date(log.dateTo).toLocaleDateString()}`;
                    } else if (log.dateFrom) {
                      dateDisplay = new Date(log.dateFrom).toLocaleDateString();
                    } else if (log.date) {
                      dateDisplay = new Date(log.date).toLocaleDateString();
                    }
                    
                    return (
                      <tr key={log._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
                          {vehicle?.vinSerial || '-'}
                        </td>
                        <td className="p-3 sm:p-4 text-xs sm:text-sm">
                          {vehicle?.make || '-'}
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
                  No maintenance records yet
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
