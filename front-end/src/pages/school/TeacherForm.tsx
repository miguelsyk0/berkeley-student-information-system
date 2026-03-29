import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createTeacher, updateTeacher } from "@/services/api";
import type { Teacher } from "@/services/api";

type TeacherFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacher?: Teacher | null;
};

export default function TeacherForm({
  isOpen, onClose, onSuccess, teacher
}: TeacherFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Teacher>>({
    employeeId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    gender: "",
    birthdate: "",
    contactNumber: "",
    email: "",
    specialization: "",
    isActive: true,
    userId: "",
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        ...teacher,
        // Ensure dates are formatted for input
        birthdate: teacher.birthdate ? new Date(teacher.birthdate).toISOString().split('T')[0] : ""
      });
    } else {
      setFormData({
        employeeId: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        gender: "",
        birthdate: "",
        contactNumber: "",
        email: "",
        specialization: "",
        isActive: true,
        userId: "",
      });
    }
  }, [teacher, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (teacher) {
        await updateTeacher(teacher.id, formData);
      } else {
        await createTeacher(formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to save teacher:", err);
      // Handle error (e.g., show toast)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl border-0 shadow-2xl p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
          <DialogHeader className="p-8 bg-slate-50 border-b border-slate-100 rounded-t-3xl">
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
              {teacher ? "Edit Teacher Profile" : "Register New Teacher"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Fill in the teacher's official details below. Fields with * are required.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 p-8 space-y-6">
            {/* Identity Group */}
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Professional Identity</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-xs font-bold text-slate-700 ml-1">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(p => ({ ...p, employeeId: e.target.value }))}
                    placeholder="E.g. 2024-T001"
                    required
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-xs font-bold text-slate-700 ml-1">Primary Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData(p => ({ ...p, specialization: e.target.value }))}
                    placeholder="E.g. Mathematics, Science"
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="userId" className="text-xs font-bold text-slate-700 ml-1">Linked Account UUID (Optional)</Label>
                  <Input
                    id="userId"
                    value={formData.userId}
                    onChange={(e) => setFormData(p => ({ ...p, userId: e.target.value }))}
                    placeholder="E.g. 550e8400-e29b-41d4-a716-446655440000"
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Name Group */}
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Personal Names</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-bold text-slate-700 ml-1">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    required
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-bold text-slate-700 ml-1">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    required
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-xs font-bold text-slate-700 ml-1">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => setFormData(p => ({ ...p, middleName: e.target.value }))}
                    placeholder="Optional"
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suffix" className="text-xs font-bold text-slate-700 ml-1">Suffix</Label>
                  <Input
                    id="suffix"
                    value={formData.suffix}
                    onChange={(e) => setFormData(p => ({ ...p, suffix: e.target.value }))}
                    placeholder="Jr, III, etc"
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label className="text-xs font-bold text-slate-700 ml-1">Gender</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(val) => setFormData(p => ({ ...p, gender: val }))}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 font-medium">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-0 shadow-xl">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Group */}
            <div className="space-y-4 pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Contact & Info</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700 ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate" className="text-xs font-bold text-slate-700 ml-1">Birth Date</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData(p => ({ ...p, birthdate: e.target.value }))}
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium appearance-none"
                  />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2 mt-2">
                  <Label htmlFor="contactNumber" className="text-xs font-bold text-slate-700 ml-1">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData(p => ({ ...p, contactNumber: e.target.value }))}
                    placeholder="+63 912 345 6789"
                    className="h-11 rounded-xl border-slate-200 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 rounded-b-3xl gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl px-6 font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-200 shadow-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-8 font-black shadow-lg shadow-teal-100 h-11 transition-all active:scale-95"
            >
              {loading ? "Processing..." : teacher ? "Update Teacher" : "Complete Registration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
