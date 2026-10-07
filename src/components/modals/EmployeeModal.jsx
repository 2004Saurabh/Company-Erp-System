import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import { useERP } from '../../context/ERPContext';

export const EmployeeModal = ({ isOpen, onClose, employeeToEdit = null }) => {
  const { addEmployee, updateEmployee, departments, employees } = useERP();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Female',
    dateOfBirth: '1995-01-01',
    department: 'Engineering',
    designation: '',
    manager: 'Marcus Sterling',
    joiningDate: '2026-10-01',
    employmentType: 'Full-Time',
    salary: 95000,
    status: 'Active',
    address: '',
    emergencyContact: '',
    skills: 'React, TypeScript, CSS',
    avatar: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        ...employeeToEdit,
        skills: Array.isArray(employeeToEdit.skills) ? employeeToEdit.skills.join(', ') : (employeeToEdit.skills || '')
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        gender: 'Female',
        dateOfBirth: '1995-01-01',
        department: departments[0]?.name || 'Engineering',
        designation: '',
        manager: 'Saurabh Kumar',
        joiningDate: '2026-10-01',
        employmentType: 'Full-Time',
        salary: 95000,
        status: 'Active',
        address: '',
        emergencyContact: '',
        skills: 'React, TypeScript, Node.js',
        avatar: ''
      });
    }
    setErrors({});
  }, [employeeToEdit, isOpen, departments]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid corporate email required.';
    }
    if (!formData.designation.trim()) errs.designation = 'Designation is required.';
    if (!formData.salary || Number(formData.salary) <= 0) errs.salary = 'Enter valid annual salary.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedSkills = typeof formData.skills === 'string'
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : formData.skills;

    const payload = {
      ...formData,
      salary: Number(formData.salary),
      skills: parsedSkills
    };

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, payload);
    } else {
      addEmployee(payload);
    }
    onClose();
  };

  const departmentOptions = departments.map(d => ({ value: d.name, label: d.name }));
  const managerOptions = employees
    .filter(e => e.role === 'owner' || e.role === 'manager' || e.designation.toLowerCase().includes('director') || e.designation.toLowerCase().includes('lead'))
    .map(e => ({ value: e.fullName, label: `${e.fullName} (${e.designation})` }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? `Edit Employee (${employeeToEdit.id})` : 'Add New Employee'}
      subtitle="Complete human capital registration details below"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {employeeToEdit ? 'Save Changes' : 'Register Employee'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Rachel Adams"
            error={errors.fullName}
          />
          <Input
            label="Corporate Email *"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="rachel.adams@company.com"
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
          <Select
            label="Gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            options={[
              { value: 'Female', label: 'Female' },
              { value: 'Male', label: 'Male' },
              { value: 'Non-Binary', label: 'Non-Binary' },
              { value: 'Prefer not to say', label: 'Prefer not to say' }
            ]}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            options={departmentOptions}
          />
          <Input
            label="Designation *"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            placeholder="e.g. Lead Solutions Architect"
            error={errors.designation}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Reporting Manager"
            value={formData.manager}
            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
            options={managerOptions.length > 0 ? managerOptions : [{ value: 'Saurabh Kumar', label: 'Saurabh Kumar (CEO)' }]}
          />
          <Input
            label="Joining Date"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          />
          <Select
            label="Employment Type"
            value={formData.employmentType}
            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
            options={[
              { value: 'Full-Time', label: 'Full-Time' },
              { value: 'Part-Time', label: 'Part-Time' },
              { value: 'Contractor', label: 'Contractor' },
              { value: 'Intern', label: 'Intern' }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Annual Base Salary (₹) *"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="e.g. 1200000"
            error={errors.salary}
          />
          <Select
            label="Account Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'On Leave', label: 'On Leave' }
            ]}
          />
        </div>

        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Street, City, State, ZIP"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Phone"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            placeholder="+1 (555) 999-9999"
          />
          <Input
            label="Skills (comma separated)"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="React, AWS, Python, Figma"
          />
        </div>
      </form>
    </Modal>
  );
};
export default EmployeeModal;
