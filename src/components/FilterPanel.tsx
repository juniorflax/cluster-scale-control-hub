
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterState {
  search: string;
  project: string;
  location: string;
  status: string;
  autoscaleEnabled: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  projects: string[];
  locations: string[];
}

export function FilterPanel({ filters, onFiltersChange, projects, locations }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      project: 'all',
      location: 'all',
      status: 'all',
      autoscaleEnabled: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '' && value !== 'all').length;
  };

  return (
    <Card className="mb-8 glass-effect border-border/50 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <span className="text-gradient">Filtros Avançados</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                {getActiveFiltersCount()} ativo{getActiveFiltersCount() > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-3">
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar Filtros
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Recolher
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Expandir
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-6">
        {/* Primary filters - always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-hover:text-primary transition-colors" />
            <Input
              placeholder="Buscar clusters, projetos..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 bg-muted/30 border-border/50 focus:border-primary/50 focus:bg-muted/50 transition-all"
            />
          </div>
          
          <Select value={filters.project} onValueChange={(value) => updateFilter('project', value)}>
            <SelectTrigger className="bg-muted/30 border-border/50 focus:border-primary/50 hover:bg-muted/50 transition-all">
              <SelectValue placeholder="Selecionar projeto" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
              <SelectItem value="all">🏢 Todos os projetos</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>📁 {project}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
            <SelectTrigger className="bg-muted/30 border-border/50 focus:border-primary/50 hover:bg-muted/50 transition-all">
              <SelectValue placeholder="Selecionar localização" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
              <SelectItem value="all">🌍 Todas as localizações</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>📍 {location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Secondary filters - expandable */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/30 animate-accordion-down">
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="bg-muted/30 border-border/50 focus:border-primary/50 hover:bg-muted/50 transition-all">
                <SelectValue placeholder="Status do cluster" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                <SelectItem value="all">📊 Todos os status</SelectItem>
                <SelectItem value="running">✅ Executando</SelectItem>
                <SelectItem value="updating">🔄 Atualizando</SelectItem>
                <SelectItem value="error">❌ Erro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.autoscaleEnabled} onValueChange={(value) => updateFilter('autoscaleEnabled', value)}>
              <SelectTrigger className="bg-muted/30 border-border/50 focus:border-primary/50 hover:bg-muted/50 transition-all">
                <SelectValue placeholder="Status do autoscale" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                <SelectItem value="all">⚙️ Todos</SelectItem>
                <SelectItem value="enabled">🚀 Autoscale ativo</SelectItem>
                <SelectItem value="disabled">⏸️ Autoscale inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
