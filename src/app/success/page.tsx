'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';

interface Session {
  amount: number;
  currency: string;
  customer_email: string;
  created_at: string | number;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/get-session-details?session_id=${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch session');
        const data: Session = await res.json();
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
        setSession(null);
      }
    };
    fetchSession();
  }, [sessionId]);

  const downloadReceipt = () => {
    alert('Receipt downloaded!');
  };

  const onBackToHome = () => {
    window.location.href = '/';
  };

  const createdDate = session ? new Date(session.created_at) : null;
  const formattedDate =
    createdDate && !isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString()
      : 'Invalid date';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎉 Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>

          {session && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-semibold">
                    ${(session.amount / 100).toFixed(2)} {session.currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-semibold">{session.customer_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Session ID:</span>
                  <span className="font-mono text-xs">{sessionId}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={downloadReceipt}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </button>

            <button
              onClick={onBackToHome}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
