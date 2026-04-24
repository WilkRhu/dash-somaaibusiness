'use client';

import { useState, useEffect } from 'react';
import { PrivacyPolicyModal } from '@/components/legal/privacy-policy-modal';

export default function PrivacyPolicyPage() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <PrivacyPolicyModal open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
