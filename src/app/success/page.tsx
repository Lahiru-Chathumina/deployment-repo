import { Suspense } from 'react';
import SuccessPageClient from './SuccessPageClient';

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <SuccessPageClient />
    </Suspense>
  );
}