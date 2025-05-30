
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Plus, Trash2, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Schedule {
  id: string;
  selectedItems: {
    projects: string[];
    clusters: string[];
    nodePools: string[];
  };
  action: 'enable' | 'disable';
  time: string;
  days: string[];
  active: boolean;
}

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

interface SchedulePanelProps {
  clusters: ClusterData[];
}

export function SchedulePanel({ clusters }: SchedulePanelProps) {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      selectedItems: {
        projects: ['my-production-project'],
        clusters: ['main-cluster'],
        nodePools: ['default-pool']
      },
      action: 'disable',
      time: '22:00',
      days: ['seg', 'ter', 'qua', 'qui', 'sex'],
      active: true
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    selectedItems: {
      projects: [] as string[],
      clusters: [] as string[],
      nodePools: [] as string[]
    },
    action: 'enable' as 'enable' | 'disable',
    time: '',
    days: [] as string[],
  });

  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const [expandedClusters, setExpandedClusters] = useState<string[]>([]);

  const dayOptions = [
    { value: 'seg', label: 'Seg' },
    { value: 'ter', label: 'Ter' },
    { value: 'qua', label: 'Qua' },
    { value: 'qui', label: 'Qui' },
    { value: 'sex', label: 'Sex' },
    { value: 'sab', label: 'Sáb' },
    { value: 'dom', label: 'Dom' }
  ];

  // Organizar dados hierarquicamente
  const projects = [...new Set(clusters.map(c => c.project))];
  const getClustersByProject = (project: string) => 
    [...new Set(clusters.filter(c => c.project === project).map(c => c.cluster))];
  const getNodePoolsByCluster = (project: string, cluster: string) =>
    clusters.filter(c => c.project === project && c.cluster === cluster).map(c => c.nodePool);

  const toggleProjectExpansion = (project: string) => {
    setExpandedProjects(prev => 
      prev.includes(project) 
        ? prev.filter(p => p !== project)
        : [...prev, project]
    );
  };

  const toggleClusterExpansion = (cluster: string) => {
    setExpandedClusters(prev => 
      prev.includes(cluster) 
        ? prev.filter(c => c !== cluster)
        : [...prev, cluster]
    );
  };

  const handleProjectSelection = (project: string, checked: boolean) => {
    const projectClusters = getClustersByProject(project);
    const projectNodePools = clusters
      .filter(c => c.project === project)
      .map(c => c.nodePool);

    setNewSchedule(prev => ({
      ...prev,
      selectedItems: {
        projects: checked 
          ? [...prev.selectedItems.projects, project]
          : prev.selectedItems.projects.filter(p => p !== project),
        clusters: checked
          ? [...prev.selectedItems.clusters, ...projectClusters]
          : prev.selectedItems.clusters.filter(c => !projectClusters.includes(c)),
        nodePools: checked
          ? [...prev.selectedItems.nodePools, ...projectNodePools]
          : prev.selectedItems.nodePools.filter(np => !projectNodePools.includes(np))
      }
    }));
  };

  const handleClusterSelection = (project: string, cluster: string, checked: boolean) => {
    const clusterNodePools = getNodePoolsByCluster(project, cluster);

    setNewSchedule(prev => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        clusters: checked
          ? [...prev.selectedItems.clusters, cluster]
          : prev.selectedItems.clusters.filter(c => c !== cluster),
        nodePools: checked
          ? [...prev.selectedItems.nodePools, ...clusterNodePools]
          : prev.selectedItems.nodePools.filter(np => !clusterNodePools.includes(np))
      }
    }));
  };

  const handleNodePoolSelection = (nodePool: string, checked: boolean) => {
    setNewSchedule(prev => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        nodePools: checked
          ? [...prev.selectedItems.nodePools, nodePool]
          : prev.selectedItems.nodePools.filter(np => np !== nodePool)
      }
    }));
  };

  const toggleDay = (day: string) => {
    setNewSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const addSchedule = () => {
    if (newSchedule.selectedItems.nodePools.length === 0 || !newSchedule.time || newSchedule.days.length === 0) {
      toast({
        title: "Erro de validação",
        description: "Selecione pelo menos um node pool, horário e dias da semana.",
        variant: "destructive",
      });
      return;
    }

    const schedule: Schedule = {
      id: Date.now().toString(),
      selectedItems: newSchedule.selectedItems,
      action: newSchedule.action,
      time: newSchedule.time,
      days: newSchedule.days,
      active: true
    };

    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      selectedItems: { projects: [], clusters: [], nodePools: [] },
      action: 'enable',
      time: '',
      days: []
    });

    toast({
      title: "Agendamento criado",
      description: "O agendamento foi adicionado com sucesso.",
    });
  };

  const removeSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Agendamento removido",
      description: "O agendamento foi removido com sucesso.",
    });
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Formulário para novo agendamento */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Novo Agendamento
        </h3>
        
        {/* Seleção hierárquica */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecionar recursos:
          </label>
          <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto bg-white">
            {projects.map(project => {
              const projectClusters = getClustersByProject(project);
              const isProjectSelected = newSchedule.selectedItems.projects.includes(project);
              const isProjectExpanded = expandedProjects.includes(project);
              
              return (
                <div key={project} className="mb-2">
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProjectExpansion(project)}
                      className="p-1 h-6 w-6"
                    >
                      {isProjectExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                    <Checkbox
                      checked={isProjectSelected}
                      onCheckedChange={(checked) => handleProjectSelection(project, checked as boolean)}
                    />
                    <span className="font-medium text-blue-600">{project}</span>
                    <Badge variant="outline" className="ml-auto">
                      {projectClusters.length} clusters
                    </Badge>
                  </div>
                  
                  {isProjectExpanded && (
                    <div className="ml-8 space-y-1">
                      {projectClusters.map(cluster => {
                        const clusterNodePools = getNodePoolsByCluster(project, cluster);
                        const isClusterSelected = newSchedule.selectedItems.clusters.includes(cluster);
                        const isClusterExpanded = expandedClusters.includes(cluster);
                        
                        return (
                          <div key={cluster}>
                            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleClusterExpansion(cluster)}
                                className="p-1 h-6 w-6"
                              >
                                {isClusterExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </Button>
                              <Checkbox
                                checked={isClusterSelected}
                                onCheckedChange={(checked) => handleClusterSelection(project, cluster, checked as boolean)}
                              />
                              <span className="text-gray-700">{cluster}</span>
                              <Badge variant="outline" className="ml-auto">
                                {clusterNodePools.length} node pools
                              </Badge>
                            </div>
                            
                            {isClusterExpanded && (
                              <div className="ml-8 space-y-1">
                                {clusterNodePools.map(nodePool => (
                                  <div key={nodePool} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                    <div className="w-6" /> {/* Espaçamento */}
                                    <Checkbox
                                      checked={newSchedule.selectedItems.nodePools.includes(nodePool)}
                                      onCheckedChange={(checked) => handleNodePoolSelection(nodePool, checked as boolean)}
                                    />
                                    <span className="text-gray-600">{nodePool}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select value={newSchedule.action} onValueChange={(value: 'enable' | 'disable') => setNewSchedule(prev => ({ ...prev, action: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enable">Ativar Autoscale</SelectItem>
              <SelectItem value="disable">Desativar Autoscale</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="time"
            value={newSchedule.time}
            onChange={(e) => setNewSchedule(prev => ({ ...prev, time: e.target.value }))}
            className="text-center"
          />

          <Button onClick={addSchedule} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dias da semana:</label>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day) => (
              <Button
                key={day.value}
                variant={newSchedule.days.includes(day.value) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleDay(day.value)}
                className={newSchedule.days.includes(day.value) ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {day.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de agendamentos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Agendamentos Ativos ({schedules.filter(s => s.active).length})
        </h3>
        
        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum agendamento configurado</p>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={schedule.active}
                    onCheckedChange={() => toggleSchedule(schedule.id)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant={schedule.action === 'enable' ? 'default' : 'secondary'}
                        className={schedule.action === 'enable' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {schedule.action === 'enable' ? 'Ativar' : 'Desativar'}
                      </Badge>
                      <span className="font-mono text-sm">{schedule.time}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>{schedule.days.join(', ')}</span> • 
                      <span className="ml-1">{schedule.selectedItems.nodePools.length} node pools selecionados</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSchedule(schedule.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
