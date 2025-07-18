
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [, setVerified] = useState(false);

  useEffect(() => {
    if (sessionId) {
      setVerified(true);
    }
  }, [sessionId]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">🎉 Payment Successful!</h1>
      <p className="mt-2">Thank you for your payment.</p>
      {sessionId && (
        <p className="text-sm text-gray-500 mt-4">Session ID: {sessionId}</p>
      )}
    </div>
  );
}
