
import { useState } from 'react';
import { AutoscaleControlPanel } from '@/components/AutoscaleControlPanel';
import { Server, Zap, Shield, Activity } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-6 p-4 glass-effect rounded-2xl">
            <div className="p-3 bg-primary/20 rounded-xl animate-glow">
              <Server className="w-8 h-8 text-primary" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gradient mb-2">
                GCP Node Autoscale Control
              </h1>
              <p className="text-lg text-muted-foreground">
                Gerencie o autoscaling dos seus clusters Kubernetes no Google Cloud Platform
              </p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-effect p-6 rounded-2xl hover:bg-card/90 transition-all duration-300 group">
              <div className="p-3 bg-green-500/20 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Controle Inteligente</h3>
              <p className="text-muted-foreground text-sm">
                Ative ou desative o autoscaling com um clique
              </p>
            </div>

            <div className="glass-effect p-6 rounded-2xl hover:bg-card/90 transition-all duration-300 group">
              <div className="p-3 bg-blue-500/20 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Agendamento</h3>
              <p className="text-muted-foreground text-sm">
                Configure horários automáticos para otimizar custos
              </p>
            </div>

            <div className="glass-effect p-6 rounded-2xl hover:bg-card/90 transition-all duration-300 group">
              <div className="p-3 bg-purple-500/20 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Monitoramento</h3>
              <p className="text-muted-foreground text-sm">
                Visualize o status de todos os seus clusters
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <AutoscaleControlPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
