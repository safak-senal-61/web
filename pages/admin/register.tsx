// pages/admin/register.tsx

import React from 'react';
import AdminRegistrationForm from '@/components/admin/AdminRegistrationForm';

const AdminRegisterPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900">
      <AdminRegistrationForm />
    </div>
  );
};

// Bu sayfa public olmalı ki ilk admin oluşturulabilsin.
AdminRegisterPage.isPublic = true;

export default AdminRegisterPage;