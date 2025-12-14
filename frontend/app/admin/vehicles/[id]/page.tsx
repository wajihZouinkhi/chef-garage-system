'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  PlusCircle, ArrowLeft, ChevronRight, ChevronLeft, Upload, X, 
  Wrench, Zap, Droplet, Paintbrush, Settings, Gauge, Trash2, ChevronDown, User,
  CheckCircle2, XCircle, Copy, Check
} from 'lucide-react';
import { getVehicleIcon } from '@/lib/vehicle-icons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DatePicker } from '@/components/ui/date-picker';
import axios from 'axios';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Checkbox } from '@/components/ui/checkbox';
import { Navbar } from '@/components/navbar';

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

export default function VehicleDetailPage() {
  const [vehicle, setVehicle] = useState<any>(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [staff, setStaff] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reason: '',
    cost: '',
    mechanicName: '',
    notes: '',
    dateType: 'single',
    date: new Date().toISOString().split('T')[0],
    dateFrom: '',
    dateTo: '',
    photos: [] as string[]
  });
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id;

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle();
      fetchMaintenanceLogs();
      fetchStaff();
    }
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicle(response.data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    }
  };

  const fetchMaintenanceLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/maintenance?vehicleId=${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaintenanceLogs(response.data);
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setLogToDelete(id);
    setDeleteDialogOpen(true);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (!logToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/maintenance/${logToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ type: 'success', message: 'Maintenance record deleted successfully!' });
      fetchMaintenanceLogs();
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error deleting maintenance log:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete maintenance record. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setDeleteDialogOpen(false);
      setLogToDelete(null);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            photos: [...prev.photos, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('handleNext called, currentStep:', currentStep);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      console.log('Moving to step:', currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedStep1 = () => {
    if (formData.dateType === 'single') {
      return formData.title.trim() !== '' && formData.date !== '';
    } else {
      return formData.title.trim() !== '' && formData.dateFrom !== '' && formData.dateTo !== '';
    }
  };

  const canProceedStep2 = () => {
    return selectedStaff.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('handleSubmit called, currentStep:', currentStep);
    
    // Only submit if we're on step 3
    if (currentStep !== 3) {
      console.log('Not on step 3, returning');
      return;
    }
    
    console.log('Submitting form...');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/maintenance', {
        ...formData,
        vehicleId,
        mechanicName: selectedStaff.join(', '), // Join multiple staff names
        cost: 0 // Default cost to 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDialogOpen(false);
      setCurrentStep(1);
      setSelectedStaff([]);
      setFormData({
        title: '',
        description: '',
        reason: '',
        cost: '',
        mechanicName: '',
        notes: '',
        dateType: 'single',
        date: new Date().toISOString().split('T')[0],
        dateFrom: '',
        dateTo: '',
        photos: []
      });
      setAlert({ type: 'success', message: 'Maintenance record added successfully!' });
      fetchMaintenanceLogs();
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error creating maintenance log:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add maintenance record. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    }
  };

  if (!vehicle) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="vehicles" />

      <main className="p-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {alert && (
          <Alert variant={alert.type === 'success' ? 'success' : 'destructive'} className="mb-6">
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription className="flex items-center justify-between">
              <span>{alert.message}</span>
              <button 
                onClick={() => setAlert(null)}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-8 mb-8 bg-gradient-to-br from-white to-gray-50 border-2 shadow-lg">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-inner border-2 border-red-200">
              {(() => {
                const { icon: VehicleIcon } = getVehicleIcon(vehicle.type);
                return <VehicleIcon className="h-16 w-16 text-red-600" />;
              })()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-lg text-gray-600 capitalize flex items-center gap-2">
                {(() => {
                  const { icon: VehicleIcon, label } = getVehicleIcon(vehicle.type);
                  return (
                    <>
                      <VehicleIcon className="h-6 w-6" />
                      {label}
                    </>
                  );
                })()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm group relative">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Matriculation</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-gray-900">{vehicle.matriculation}</p>
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
                <p className="text-xl font-bold text-gray-900">{vehicle.vinSerial || '-'}</p>
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
              <p className="text-xl font-bold text-gray-900">{vehicle.make || '-'}</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">Maintenance History</h3>
            <p className="text-gray-600 mt-1">Manage and track all maintenance records</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="max-w-2xl max-h-[90vh] overflow-y-auto"
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">Add Maintenance Record - Step {currentStep} of 3</DialogTitle>
                <DialogDescription className="text-base mt-2">
                  {currentStep === 1 && "What was fixed and when?"}
                  {currentStep === 2 && "Who performed the work?"}
                  {currentStep === 3 && "Add photos (optional)"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: What & When */}
                {currentStep === 1 && (
                  <div className="space-y-6 py-4">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-base font-semibold">
                        What was fixed? *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Oil change, brake repair, etc."
                        className="h-12 text-base"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Date Type *</Label>
                      <RadioGroup
                        value={formData.dateType}
                        onValueChange={(value) => setFormData({ ...formData, dateType: value })}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="single" id="single" className="h-5 w-5" />
                          <Label htmlFor="single" className="text-base font-normal cursor-pointer">
                            Single Day
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="range" id="range" className="h-5 w-5" />
                          <Label htmlFor="range" className="text-base font-normal cursor-pointer">
                            Date Range (From...To...)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.dateType === 'single' ? (
                      <div className="space-y-3">
                        <Label htmlFor="date" className="text-base font-semibold">Date *</Label>
                        <DatePicker
                          date={formData.date ? new Date(formData.date) : undefined}
                          onDateChange={(date) => setFormData({ 
                            ...formData, 
                            date: date ? date.toISOString().split('T')[0] : '' 
                          })}
                          placeholder="Select date"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="dateFrom" className="text-base font-semibold">From *</Label>
                          <DatePicker
                            date={formData.dateFrom ? new Date(formData.dateFrom) : undefined}
                            onDateChange={(date) => setFormData({ 
                              ...formData, 
                              dateFrom: date ? date.toISOString().split('T')[0] : '' 
                            })}
                            placeholder="Select start date"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="dateTo" className="text-base font-semibold">To *</Label>
                          <DatePicker
                            date={formData.dateTo ? new Date(formData.dateTo) : undefined}
                            onDateChange={(date) => setFormData({ 
                              ...formData, 
                              dateTo: date ? date.toISOString().split('T')[0] : '' 
                            })}
                            placeholder="Select end date"
                            disabled={!formData.dateFrom}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Who */}
                {currentStep === 2 && (
                  <div className="space-y-6 py-4">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Staff Members * (Select at least one)
                      </Label>
                      <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
                        {staff.map((member: any) => (
                          <div key={member._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              id={member._id}
                              checked={selectedStaff.includes(member.name)}
                              onCheckedChange={(checked: boolean) => {
                                if (checked) {
                                  setSelectedStaff([...selectedStaff, member.name]);
                                } else {
                                  setSelectedStaff(selectedStaff.filter(name => name !== member.name));
                                }
                              }}
                            />
                            <label
                              htmlFor={member._id}
                              className="flex-1 text-sm font-medium cursor-pointer"
                            >
                              {member.name} - {member.position}
                            </label>
                          </div>
                        ))}
                      </div>
                      {selectedStaff.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Selected: {selectedStaff.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Photos */}
                {currentStep === 3 && (
                  <div className="space-y-6 py-4">
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Photos (Optional)
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Upload from Gallery */}
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                            id="photo-upload"
                          />
                          <label htmlFor="photo-upload" className="cursor-pointer">
                            <Upload className="mx-auto h-12 w-12 text-blue-500" />
                            <p className="mt-2 text-sm text-gray-600 font-medium">
                              Upload from Gallery
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Select photos</p>
                          </label>
                        </div>

                        {/* Take Photo with Camera */}
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            id="camera-capture"
                          />
                          <label htmlFor="camera-capture" className="cursor-pointer">
                            <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600 font-medium">
                              Take Photo
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Use camera</p>
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label htmlFor="notes" className="text-base font-semibold">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional notes..."
                        className="min-h-[120px] max-h-[200px] text-base resize-none"
                      />
                    </div>
                  </div>
                )}

                <DialogFooter className="flex justify-between">
                  <div className="flex gap-2">
                    {currentStep > 1 && (
                      <Button type="button" variant="outline" onClick={handleBack}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => {
                      setDialogOpen(false);
                      setCurrentStep(1);
                    }}>
                      Cancel
                    </Button>
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={currentStep === 1 ? !canProceedStep1() : !canProceedStep2()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Save Maintenance
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {maintenanceLogs.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No maintenance records yet
          </Card>
        ) : (
          <Timeline position="right">
            {[...maintenanceLogs].reverse().map((log: any, index: number) => {
              const { icon: Icon, color, bgColor } = getMaintenanceIcon(log.mechanicName, staff);
              const isExpanded = expandedLog === log._id;
              
              // Handle both old (date) and new (dateFrom/dateTo) formats
              const formatDate = (dateStr: string) => {
                return new Date(dateStr).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                });
              };
              
              let dateDisplay = '';
              let durationText = '';
              
              if (log.dateType === 'range' && log.dateFrom && log.dateTo) {
                dateDisplay = `${formatDate(log.dateFrom)} - ${formatDate(log.dateTo)}`;
                // Calculate number of days
                const startDate = new Date(log.dateFrom);
                const endDate = new Date(log.dateTo);
                const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                durationText = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
              } else if (log.dateFrom) {
                dateDisplay = formatDate(log.dateFrom);
                durationText = '1 day';
              } else if (log.date) {
                dateDisplay = formatDate(log.date);
                durationText = '1 day';
              }
              
              return (
              <TimelineItem key={log._id}>
                <TimelineOppositeContent 
                  sx={{ 
                    flex: 0.3,
                    paddingRight: 3,
                    paddingTop: 2
                  }}
                  color="text.secondary"
                >
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">
                      {dateDisplay}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {durationText}
                    </p>
                  </div>
                </TimelineOppositeContent>
                
                <TimelineSeparator>
                  <TimelineDot 
                    sx={{ 
                      bgcolor: bgColor,
                      border: `2px solid ${color}`,
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </TimelineDot>
                  {index < maintenanceLogs.length - 1 && (
                    <TimelineConnector sx={{ bgcolor: '#d1d5db', minHeight: 60 }} />
                  )}
                </TimelineSeparator>
                
                <TimelineContent sx={{ paddingLeft: 3, paddingTop: 1, paddingBottom: 4 }}>
                  <Card 
                    className="shadow-lg hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden border-2 border-gray-100"
                    onClick={() => setExpandedLog(isExpanded ? null : log._id)}
                  >
                    {/* Header - Always Visible - BIGGER */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-gray-900 mb-3">{log.title}</h4>
                          <div className="flex items-center gap-3 text-base text-gray-600 mb-2">
                            <User className="h-5 w-5" />
                            <span className="font-medium">{log.mechanicName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(log._id);
                            }}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete maintenance record"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <ChevronDown 
                            className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </div>

                      {/* Preview - Always Visible */}
                      <div className="space-y-3 text-base">
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

                    {/* Expandable Content - FULL DETAILS */}
                    <div 
                      className={`transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 pb-6 space-y-4">
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
                              <p className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
                                Photos Gallery ({log.photos.length})
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {log.photos.map((photo: string, photoIndex: number) => (
                                  <div key={photoIndex} className="relative group">
                                    <img
                                      src={photo}
                                      alt={`Maintenance ${photoIndex + 1}`}
                                      className="w-full h-40 object-cover rounded-xl border-3 border-gray-300 group-hover:border-blue-500 transition-all shadow-md group-hover:shadow-xl"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-xl flex items-center justify-center">
                                      <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        View
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </TimelineContent>
              </TimelineItem>
              );
            })}
          </Timeline>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this maintenance record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
