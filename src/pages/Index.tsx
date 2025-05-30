
import { useState } from 'react';
import { AutoscaleControlPanel } from '@/components/AutoscaleControlPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GCP Node Autoscale Control
          </h1>
          <p className="text-lg text-gray-600">
            Gerencie o autoscaling dos seus clusters Kubernetes no Google Cloud Platform
          </p>
        </div>
        <AutoscaleControlPanel />
      </div>
    </div>
  );
};

export default Index;
