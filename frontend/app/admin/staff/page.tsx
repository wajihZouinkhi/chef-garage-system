'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { PlusCircle, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { staffPositions } from '@/lib/staff-positions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/navbar';
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

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    phone: ''
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/staff`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDialogOpen(false);
      setFormData({ name: '', position: '', phone: '' });
      setAlert({ type: 'success', message: 'Staff member added successfully!' });
      fetchStaff();
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error creating staff:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add staff member. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleDeleteClick = (id: string) => {
    setStaffToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!staffToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/staff/${staffToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ type: 'success', message: 'Staff member deleted successfully!' });
      fetchStaff();
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    } catch (error: any) {
      console.error('Error deleting staff:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete staff member. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    } finally {
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage="staff" />

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
          <h2 className="text-3xl font-bold">Staff Members</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Fill in the staff member details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => setFormData({ ...formData, position: value })}
                      required
                    >
                      <SelectTrigger id="position">
                        <SelectValue placeholder="Select Position" />
                      </SelectTrigger>
                      <SelectContent>
                        {staffPositions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Save Staff
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
                  <th className="h-12 px-4 text-left font-medium">Name</th>
                  <th className="h-12 px-4 text-left font-medium">Position</th>
                  <th className="h-12 px-4 text-left font-medium">Phone</th>
                  <th className="h-12 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member: any) => (
                  <tr key={member._id} className="border-b">
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4">{member.position}</td>
                    <td className="p-4">{member.phone || '-'}</td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(member._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
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
                This action cannot be undone. This will permanently delete this staff member.
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
