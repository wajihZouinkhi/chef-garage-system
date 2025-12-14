'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Wrench, Zap, Droplet, Paintbrush, Settings, Gauge, ChevronDown, User, Copy, Check, Search, X } from 'lucide-react';
import { getVehicleIcon } from '@/lib/vehicle-icons';
import { getBrandLogo } from '@/lib/vehicle-brands';
import axios from 'axios';
import { SimpleTimeline, SimpleTimelineItem } from '@/components/simple-timeline';
import { Navbar } from '@/components/navbar';
import ErrorBoundary from '@/components/error-boundary';

// Function to get icon and color based on staff position
const getMaintenanceIcon = (mechanicName: string, staff: any[]) => {
  const staffMember = staff.find((s: any) => s.name === mechanicName);
  const position = staffMember?.position?.toLowerCase() || '';
  
  if (position.includes('electric') || position.includes('électric')) {
    return { icon: Zap, color: '#eab308', bgColor: '#fef9c3' }; // Yellow
  } else if (position.includes('plumb') || position.includes('plomb')) {
    return { icon: Droplet, color: '#3b82f6', bgColor: '#dbeafe' }; // Blue
  } else if (position.includes('paint') || position.includes('peintr')) {
    return { icon: Paintbrush, color: '#ec4899', bgColor: '#fce7f3' }; // Pink
  } else if (position.includes('mechanic') || position.includes('mécan')) {
    return { icon: Wrench, color: '#16a34a', bgColor: '#dcfce7' }; // Green
  } else if (position.includes('diagnostic')) {
    return { icon: Gauge, color: '#8b5cf6', bgColor: '#ede9fe' }; // Purple
  } else {
    return { icon: Settings, color: '#6b7280', bgColor: '#f3f4f6' }; // Gray
  }
};

interface MaintenanceLog {
  _id: string;
  title: string;
  description: string;
  cost: number;
  mechanicName?: string;
  staffId?: string;
  staffName?: string;
  photos: string[];
  notes: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  dateType?: string;
}

interface Vehicle {
  _id: string;
  type: string;
  make: string;
  model: string;
  matriculation: string;
  vinSerial: string;
}

export default function VehicleHistoryPage() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLogs, setFilteredLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id as string;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    const loadData = async () => {
      if (vehicleId) {
        setLoading(true);
        setError(null);
        
        try {
          await Promise.all([
            fetchVehicle(),
            fetchMaintenanceLogs(),
            fetchStaff()
          ]);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [vehicleId]);

  // Filter maintenance logs based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLogs(maintenanceLogs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = maintenanceLogs.filter((log) => {
        // Search in title
        if (log.title?.toLowerCase().includes(query)) return true;
        
        // Search in description
        if (log.description?.toLowerCase().includes(query)) return true;
        
        // Search in notes
        if (log.notes?.toLowerCase().includes(query)) return true;
        
        // Search in mechanic name
        if (log.mechanicName?.toLowerCase().includes(query)) return true;
        if (log.staffName?.toLowerCase().includes(query)) return true;
        
        // Search in date (formatted)
        const formatDate = (dateStr: string) => {
          return new Date(dateStr).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          }).toLowerCase();
        };
        
        if (log.dateType === 'range' && log.dateFrom && log.dateTo) {
          const dateRange = `${formatDate(log.dateFrom)} - ${formatDate(log.dateTo)}`;
          if (dateRange.includes(query)) return true;
        } else if (log.dateFrom) {
          if (formatDate(log.dateFrom).includes(query)) return true;
        } else if (log.date) {
          if (formatDate(log.date).includes(query)) return true;
        }
        
        return false;
      });
      setFilteredLogs(filtered);
    }
  }, [searchQuery, maintenanceLogs]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicle(response.data);
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        router.push('/login');
      } else if (error.response?.status === 404) {
        setError('Vehicle not found.');
      } else {
        setError('Failed to load vehicle information.');
      }
    }
  };

  const fetchMaintenanceLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/maintenance?vehicleId=${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaintenanceLogs(response.data);
    } catch (error: any) {
      console.error('Error fetching maintenance logs:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        router.push('/login');
      } else {
        setError('Failed to load maintenance history.');
      }
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (error: any) {
      console.error('Error fetching staff:', error);
      // Staff data is not critical, so we don't set error state for this
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="vehicles" />
        <main className="p-4 sm:p-6 lg:p-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading vehicle history...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="vehicles" />
        <main className="p-4 sm:p-6 lg:p-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Card className="p-6 sm:p-8 text-center">
            <div className="py-8">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Vehicle not found
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="vehicles" />
        <main className="p-4 sm:p-6 lg:p-8">
          <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Card className="p-6 sm:p-8 text-center text-gray-500">
            <div className="py-8">
              <Wrench className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Vehicle Not Found</h3>
              <p className="text-sm sm:text-base text-gray-500">The requested vehicle could not be found.</p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage="vehicles" />

      <main className="p-4 sm:p-6 lg:p-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 bg-gradient-to-br from-white to-gray-50 border-2 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-2xl shadow-inner border-2 border-red-200">
              {(() => {
                const { icon: VehicleIcon } = getVehicleIcon(vehicle.type);
                return <VehicleIcon className="h-12 w-12 sm:h-16 sm:w-16 text-red-600" />;
              })()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 capitalize flex items-center gap-2 mt-1">
                {(() => {
                  const { icon: VehicleIcon, label } = getVehicleIcon(vehicle.type);
                  return (
                    <>
                      <VehicleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      {label}
                    </>
                  );
                })()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm group relative">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Matriculation</p>
              <div className="flex items-center justify-between">
                <p className="text-lg sm:text-xl font-bold text-gray-900 break-all">{vehicle.matriculation}</p>
                <button
                  onClick={() => copyToClipboard(vehicle.matriculation, 'matriculation')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded"
                  title="Copy to clipboard"
                >
                  {copiedField === 'matriculation' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm group relative">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">VIN/Serial Number</p>
              <div className="flex items-center justify-between">
                <p className="text-lg sm:text-xl font-bold text-gray-900 break-all">{vehicle.vinSerial || '-'}</p>
                {vehicle.vinSerial && (
                  <button
                    onClick={() => copyToClipboard(vehicle.vinSerial, 'vin')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded"
                    title="Copy to clipboard"
                  >
                    {copiedField === 'vin' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Brand</p>
              <div className="flex items-center gap-3">
                {(() => {
                  const brandLogo = getBrandLogo(vehicle.make || '');
                  return brandLogo ? (
                    <img 
                      src={brandLogo} 
                      alt={`${vehicle.make} logo`}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null;
                })()}
                <p className="text-lg sm:text-xl font-bold text-gray-900">{vehicle.make || '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Maintenance History</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Read-only view of all maintenance records</p>
            <div className="mt-3 sm:mt-4 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg border border-blue-200 inline-block">
              <p className="text-xs sm:text-sm font-semibold text-blue-800">
                {filteredLogs.length} of {maintenanceLogs.length} Record{maintenanceLogs.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {/* Search Bar on the Right */}
          <div className="w-full lg:w-96">
            <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-white to-blue-50">
              <div className="relative p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 py-2.5 text-sm sm:text-base border-2 border-blue-200 focus:border-blue-500 bg-white rounded-lg shadow-sm focus:shadow-md transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                {searchQuery && (
                  <div className="mt-3 bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-800">
                          {filteredLogs.length} result{filteredLogs.length !== 1 ? 's' : ''}
                        </span>
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                          "{searchQuery}"
                        </span>
                      </div>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {maintenanceLogs.length === 0 ? (
          <Card className="p-6 sm:p-8 text-center text-gray-500">
            <div className="py-8">
              <Wrench className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No maintenance records yet</h3>
              <p className="text-sm sm:text-base text-gray-500">Maintenance history will appear here once records are added.</p>
            </div>
          </Card>
        ) : filteredLogs.length === 0 ? (
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="p-6 sm:p-8 lg:p-12 text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300/20 to-blue-300/20 rounded-full blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-blue-100 p-4 sm:p-6 rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center">
                  <Search className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                </div>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">No records found</h4>
              <p className="text-gray-500 text-base sm:text-lg mb-2">
                No maintenance records match your search for
              </p>
              <div className="bg-gray-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-base sm:text-lg font-bold inline-block mb-4 sm:mb-6 break-all">
                "{searchQuery}"
              </div>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <X className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Clear search
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <ErrorBoundary>
            <SimpleTimeline>
              {[...filteredLogs].reverse().map((log: any, index: number) => {
                try {
                  const { icon: Icon, color, bgColor } = getMaintenanceIcon(log.mechanicName, staff);
                  const isExpanded = expandedLog === log._id;
                  const isLast = index === filteredLogs.length - 1;
              
              let dateDisplay = '';
              let durationText = '';
              
              if (log.dateType === 'range' && log.dateFrom && log.dateTo) {
                dateDisplay = `${new Date(log.dateFrom).toLocaleDateString()} - ${new Date(log.dateTo).toLocaleDateString()}`;
                const startDate = new Date(log.dateFrom);
                const endDate = new Date(log.dateTo);
                const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                durationText = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
              } else if (log.dateFrom) {
                dateDisplay = new Date(log.dateFrom).toLocaleDateString();
                durationText = '1 day';
              } else if (log.date) {
                dateDisplay = new Date(log.date).toLocaleDateString();
                durationText = '1 day';
              }
              
              return (
                <SimpleTimelineItem 
                  key={log._id}
                  icon={<Icon className="h-5 w-5" style={{ color }} />}
                  color={color}
                  bgColor={bgColor}
                  isLast={isLast}
                >
                  <div className="mb-4">
                    <div className="text-right mb-4">
                      <p className="text-sm font-semibold text-gray-700">{dateDisplay}</p>
                      <p className="text-xs text-gray-500 mt-1">{durationText}</p>
                    </div>
                    <Card className="shadow-lg hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden border-2 border-gray-100" onClick={() => setExpandedLog(isExpanded ? null : log._id)}>
                      <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{log.title}</h4>
                            <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 mb-2">
                              <User className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="font-medium">{log.mechanicName}</span>
                            </div>
                          </div>
                          <ChevronDown className={`h-5 w-5 sm:h-6 sm:w-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>

                        <div className="space-y-3 text-sm sm:text-base">
                          {log.description && (
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-gray-700 min-w-[100px]">Description:</span>
                              <p className="text-gray-600 line-clamp-2">{log.description}</p>
                            </div>
                          )}
                          
                          {log.notes && (
                            <div className="flex items-start gap-2">
                              <span className="font-semibold text-gray-700 min-w-[100px]">Notes:</span>
                              <p className="text-gray-600 line-clamp-2">{log.notes}</p>
                            </div>
                          )}

                          {log.photos && log.photos.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-700">Photos:</span>
                              <span className="text-gray-600">{log.photos.length} photo(s)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ overflow: 'hidden' }}>
                        <div className="px-4 sm:px-6 pb-6 space-y-4">
                          <div className="border-t-2 border-gray-200 pt-4">
                            <h5 className="text-lg font-bold text-gray-800 mb-4">Full Details</h5>
                            
                            {log.description && (
                              <div className="mb-4 p-5 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                <p className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-wide">Description</p>
                                <p className="text-base text-gray-800 leading-relaxed">{log.description}</p>
                              </div>
                            )}
                            
                            {log.notes && (
                              <div className="mb-4 p-5 bg-amber-50 rounded-xl border-l-4 border-amber-500">
                                <p className="text-sm font-bold text-amber-800 mb-2 uppercase tracking-wide">Additional Notes</p>
                                <p className="text-base text-gray-800 leading-relaxed">{log.notes}</p>
                              </div>
                            )}
                            
                            {log.photos && log.photos.length > 0 && (
                              <div className="p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
                                <p className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Photos Gallery ({log.photos.length})</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {log.photos.map((photo: string, photoIndex: number) => (
                                    <div key={photoIndex} className="relative group">
                                      <img src={photo} alt={`Maintenance ${photoIndex + 1}`} className="w-full h-40 object-cover rounded-xl border-3 border-gray-300 group-hover:border-blue-500 transition-all shadow-md group-hover:shadow-xl" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </SimpleTimelineItem>
                  );
                } catch (error) {
                  console.error('Error rendering timeline item:', error);
                  return (
                    <div key={log._id} className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <p className="text-red-600 text-sm">Error displaying maintenance record</p>
                    </div>
                  );
                }
              })}
            </SimpleTimeline>
          </ErrorBoundary>
        )}
      </main>
    </div>
    </ErrorBoundary>
  );
}