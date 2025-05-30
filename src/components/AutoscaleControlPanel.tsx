import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Settings, Cloud, MapPin, Database, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FilterPanel } from './FilterPanel';
import { SchedulePanel } from './SchedulePanel';

interface ClusterData {
  id: string;
  project: string;
  location: string;
  cluster: string;
  nodePool: string;
  autoscaleEnabled: boolean;
  minNodes: number;
  maxNodes: number;
  currentNodes: number;
  status: 'running' | 'updating' | 'error';
}

interface FilterState {
  search: string;
  project: string;
  location: string;
  status: string;
  autoscaleEnabled: string;
}

export function AutoscaleControlPanel() {
  const { toast } = useToast();
  
  const [clusters, setClusters] = useState<ClusterData[]>([
    {
      id: '1',
      project: 'my-production-project',
      location: 'us-central1-a',
      cluster: 'main-cluster',
      nodePool: 'default-pool',
      autoscaleEnabled: true,
      minNodes: 2,
      maxNodes: 10,
      currentNodes: 4,
      status: 'running'
    },
    {
      id: '2',
      project: 'my-staging-project',
      location: 'us-east1-b',
      cluster: 'staging-cluster',
      nodePool: 'worker-pool',
      autoscaleEnabled: false,
      minNodes: 1,
      maxNodes: 5,
      currentNodes: 2,
      status: 'running'
    },
    {
      id: '3',
      project: 'my-dev-project',
      location: 'europe-west1-c',
      cluster: 'dev-cluster',
      nodePool: 'dev-pool',
      autoscaleEnabled: true,
      minNodes: 1,
      maxNodes: 3,
      currentNodes: 1,
      status: 'updating'
    }
  ]);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    project: 'all',
    location: 'all',
    status: 'all',
    autoscaleEnabled: 'all'
  });

  const handleAutoscaleToggle = (clusterId: string) => {
    setClusters(prev => prev.map(cluster => 
      cluster.id === clusterId 
        ? { ...cluster, autoscaleEnabled: !cluster.autoscaleEnabled }
        : cluster
    ));
    
    toast({
      title: "Autoscale atualizado",
      description: "As configurações de autoscale foram modificadas.",
    });
  };

  const handleMinNodesChange = (clusterId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setClusters(prev => prev.map(cluster => 
      cluster.id === clusterId 
        ? { ...cluster, minNodes: numValue }
        : cluster
    ));
  };

  const handleMaxNodesChange = (clusterId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setClusters(prev => prev.map(cluster => 
      cluster.id === clusterId 
        ? { ...cluster, maxNodes: numValue }
        : cluster
    ));
  };

  const handleSaveChanges = (clusterId: string) => {
    const cluster = clusters.find(c => c.id === clusterId);
    if (cluster && cluster.minNodes > cluster.maxNodes) {
      toast({
        title: "Erro de validação",
        description: "O número mínimo de nodes não pode ser maior que o máximo.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas ao cluster.",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      running: { label: 'Executando', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      updating: { label: 'Atualizando', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      error: { label: 'Erro', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Função para filtrar clusters
  const filteredClusters = clusters.filter(cluster => {
    const matchesSearch = !filters.search || 
      cluster.cluster.toLowerCase().includes(filters.search.toLowerCase()) ||
      cluster.project.toLowerCase().includes(filters.search.toLowerCase()) ||
      cluster.nodePool.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesProject = filters.project === 'all' || cluster.project === filters.project;
    const matchesLocation = filters.location === 'all' || cluster.location === filters.location;
    const matchesStatus = filters.status === 'all' || cluster.status === filters.status;
    const matchesAutoscale = filters.autoscaleEnabled === 'all' || 
      (filters.autoscaleEnabled === 'enabled' && cluster.autoscaleEnabled) ||
      (filters.autoscaleEnabled === 'disabled' && !cluster.autoscaleEnabled);

    return matchesSearch && matchesProject && matchesLocation && matchesStatus && matchesAutoscale;
  });

  // Extrair valores únicos para os filtros
  const uniqueProjects = [...new Set(clusters.map(c => c.project))];
  const uniqueLocations = [...new Set(clusters.map(c => c.location))];

  return (
    <div className="space-y-6">
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        projects={uniqueProjects}
        locations={uniqueLocations}
      />
      
      <SchedulePanel 
        clusters={clusters.map(c => ({ id: c.id, cluster: c.cluster, project: c.project }))}
      />

      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Settings className="w-6 h-6" />
            Controle de Autoscale dos Clusters
            <Badge variant="secondary" className="bg-white/20 text-white">
              {filteredClusters.length} de {clusters.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    Projeto
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Localização
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Cluster
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Node Pool
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nodes Atuais</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Autoscale</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Min Nodes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Max Nodes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClusters.map((cluster) => (
                  <tr key={cluster.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {cluster.project}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cluster.location}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {cluster.cluster}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {cluster.nodePool}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(cluster.status)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {cluster.currentNodes}
                    </td>
                    <td className="px-6 py-4">
                      <Switch
                        checked={cluster.autoscaleEnabled}
                        onCheckedChange={() => handleAutoscaleToggle(cluster.id)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="number"
                        value={cluster.minNodes}
                        onChange={(e) => handleMinNodesChange(cluster.id, e.target.value)}
                        className="w-20 text-center"
                        min="0"
                        disabled={!cluster.autoscaleEnabled}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="number"
                        value={cluster.maxNodes}
                        onChange={(e) => handleMaxNodesChange(cluster.id, e.target.value)}
                        className="w-20 text-center"
                        min="1"
                        disabled={!cluster.autoscaleEnabled}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        onClick={() => handleSaveChanges(cluster.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!cluster.autoscaleEnabled}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredClusters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum cluster encontrado com os filtros aplicados</p>
              <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou limpar a busca</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clusters Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredClusters.filter(c => c.status === 'running').length}
                </p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Nodes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredClusters.reduce((sum, cluster) => sum + cluster.currentNodes, 0)}
                </p>
              </div>
              <Layers className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Autoscale Ativo</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredClusters.filter(c => c.autoscaleEnabled).length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
