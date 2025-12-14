'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
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
import { PlusCircle, Edit, Trash2, History, CheckCircle2, XCircle } from 'lucide-react';
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
import axios from 'axios';
import { vehicleBrands, getBrandsByType } from '@/lib/vehicle-brands';
import { vehicleIcons } from '@/lib/vehicle-icons';
import { Navbar } from '@/components/navbar';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'car',
    make: '',
    model: '',
    matriculation: '',
    vinSerial: '',
    meta: {}
  });
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setAvailableBrands(getBrandsByType(formData.type));
    setFormData(prev => ({ ...prev, make: '', model: '', matriculation: '', vinSerial: '' }));
  }, [formData.type]);

  useEffect(() => {
    if (formData.make && vehicleBrands[formData.make as keyof typeof vehicleBrands]) {
      setAvailableModels(vehicleBrands[formData.make as keyof typeof vehicleBrands].models);
    } else {
      setAvailableModels([]);
    }
    setFormData(prev => ({ ...prev, model: '' }));
  }, [formData.make]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDialogOpen(false);
      setFormData({ type: 'car', make: '', model: '', matriculation: '', vinSerial: '', meta: {} });
      setAlert({ type: 'success', message: 'Vehicle added successfully!' });
      fetchVehicles();
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add vehicle. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleDeleteClick = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicleToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ type: 'success', message: 'Vehicle deleted successfully!' });
      fetchVehicles();
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete vehicle. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="vehicles" />

      <main className="p-8">
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

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Vehicles</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>
                  Fill in the vehicle details below. Fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="type" className="text-base font-semibold">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger id="type" className="h-12 text-base">
                        <SelectValue>
                          {formData.type && (() => {
                            const { icon: Icon, label } = vehicleIcons[formData.type as keyof typeof vehicleIcons];
                            return (
                              <div className="flex items-center gap-2">
                                <Icon className="h-5 w-5" />
                                {label}
                              </div>
                            );
                          })()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(vehicleIcons).map(([key, { icon: Icon, label }]) => (
                          <SelectItem key={key} value={key} className="text-base py-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="matriculation" className="text-base font-semibold">Matriculation *</Label>
                    <Input
                      id="matriculation"
                      value={formData.matriculation}
                      onChange={(e) => setFormData({ ...formData, matriculation: e.target.value.toUpperCase() })}
                      placeholder="RS 246625"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="vinSerial" className="text-base font-semibold">VIN/Serial Number</Label>
                    <Input
                      id="vinSerial"
                      value={formData.vinSerial}
                      onChange={(e) => setFormData({ ...formData, vinSerial: e.target.value.toUpperCase() })}
                      placeholder="YV3R6R721BA144981"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="brand" className="text-base font-semibold">Brand</Label>
                    <Combobox
                      options={availableBrands}
                      value={formData.make}
                      onChange={(value) => setFormData({ ...formData, make: value })}
                      placeholder="Select or type brand..."
                      searchPlaceholder="Search brands..."
                      renderOption={(brand) => (
                        <>
                          {vehicleBrands[brand as keyof typeof vehicleBrands]?.logo && (
                            <img 
                              src={vehicleBrands[brand as keyof typeof vehicleBrands]?.logo} 
                              alt={brand}
                              className="w-5 h-5 object-contain rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <span>{brand}</span>
                        </>
                      )}
                      allowCustom={true}
                    />
                  </div>
                  <div className="space-y-3 col-span-2">
                    <Label htmlFor="model" className="text-base font-semibold">Model</Label>
                    {formData.make && availableModels.length > 0 ? (
                      <Combobox
                        options={availableModels}
                        value={formData.model}
                        onChange={(value) => setFormData({ ...formData, model: value })}
                        placeholder="Select or type model..."
                        searchPlaceholder="Search models..."
                        allowCustom={true}
                      />
                    ) : (
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="Enter model..."
                        className="h-12 text-base"
                      />
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Save Vehicle
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="h-12 px-4 text-left font-medium">Type</th>
                  <th className="h-12 px-4 text-left font-medium">Matriculation</th>
                  <th className="h-12 px-4 text-left font-medium">VIN/Serial</th>
                  <th className="h-12 px-4 text-left font-medium">Brand</th>
                  <th className="h-12 px-4 text-left font-medium">Model</th>
                  <th className="h-12 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle: any) => (
                  <tr key={vehicle._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {(() => {
                        const vehicleIcon = vehicleIcons[vehicle.type as keyof typeof vehicleIcons];
                        if (vehicleIcon) {
                          const Icon = vehicleIcon.icon;
                          return (
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              <span className="capitalize">{vehicleIcon.label}</span>
                            </div>
                          );
                        }
                        return <span className="capitalize">{vehicle.type}</span>;
                      })()}
                    </td>
                    <td className="p-4 font-medium">{vehicle.matriculation}</td>
                    <td className="p-4 text-sm text-gray-600">{vehicle.vinSerial || '-'}</td>
                    <td className="p-4">
                      {vehicle.make ? (
                        <span className="flex items-center gap-3">
                          {vehicleBrands[vehicle.make as keyof typeof vehicleBrands]?.logo && (
                            <img 
                              src={vehicleBrands[vehicle.make as keyof typeof vehicleBrands]?.logo} 
                              alt={vehicle.make}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <span>{vehicle.make}</span>
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-4">{vehicle.model || '-'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/vehicles/${vehicle._id}/history`)}
                          title="View maintenance history"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/vehicles/${vehicle._id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(vehicle._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this vehicle and all its maintenance records.
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
