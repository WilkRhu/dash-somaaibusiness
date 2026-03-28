'use client';

import { useState, useEffect } from 'react';
import { TermsOfServiceModal } from '@/components/legal/terms-of-service-modal';

export default function TermsOfServicePage() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <TermsOfServiceModal open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
