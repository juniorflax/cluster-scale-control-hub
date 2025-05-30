
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Schedule {
  id: string;
  clusterId: string;
  clusterName: string;
  action: 'enable' | 'disable';
  time: string;
  days: string[];
  active: boolean;
}

interface SchedulePanelProps {
  clusters: Array<{ id: string; cluster: string; project: string }>;
}

export function SchedulePanel({ clusters }: SchedulePanelProps) {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      clusterId: '1',
      clusterName: 'main-cluster',
      action: 'disable',
      time: '22:00',
      days: ['seg', 'ter', 'qua', 'qui', 'sex'],
      active: true
    },
    {
      id: '2',
      clusterId: '1',
      clusterName: 'main-cluster',
      action: 'enable',
      time: '08:00',
      days: ['seg', 'ter', 'qua', 'qui', 'sex'],
      active: true
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    clusterId: '',
    action: 'enable' as 'enable' | 'disable',
    time: '',
    days: [] as string[],
  });

  const dayOptions = [
    { value: 'seg', label: 'Seg' },
    { value: 'ter', label: 'Ter' },
    { value: 'qua', label: 'Qua' },
    { value: 'qui', label: 'Qui' },
    { value: 'sex', label: 'Sex' },
    { value: 'sab', label: 'Sáb' },
    { value: 'dom', label: 'Dom' }
  ];

  const toggleDay = (day: string) => {
    setNewSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const addSchedule = () => {
    if (!newSchedule.clusterId || !newSchedule.time || newSchedule.days.length === 0) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const cluster = clusters.find(c => c.id === newSchedule.clusterId);
    const schedule: Schedule = {
      id: Date.now().toString(),
      clusterId: newSchedule.clusterId,
      clusterName: cluster?.cluster || '',
      action: newSchedule.action,
      time: newSchedule.time,
      days: newSchedule.days,
      active: true
    };

    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      clusterId: '',
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
    <Card className="mb-6 shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="w-6 h-6" />
          Agendamento de Autoscale
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Formulário para novo agendamento */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Novo Agendamento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select value={newSchedule.clusterId} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, clusterId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar cluster" />
              </SelectTrigger>
              <SelectContent>
                {clusters.map((cluster) => (
                  <SelectItem key={cluster.id} value={cluster.id}>
                    {cluster.cluster} ({cluster.project})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                        <span className="font-medium text-gray-900">{schedule.clusterName}</span>
                        <Badge 
                          variant={schedule.action === 'enable' ? 'default' : 'secondary'}
                          className={schedule.action === 'enable' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {schedule.action === 'enable' ? 'Ativar' : 'Desativar'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-mono">{schedule.time}</span> • {schedule.days.join(', ')}
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
      </CardContent>
    </Card>
  );
}
