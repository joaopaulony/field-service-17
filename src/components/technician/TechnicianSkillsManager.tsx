
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Star, Trash2 } from 'lucide-react';
import { TechnicianSkill, TechnicianSkillMapping, Technician } from '@/types/workOrders';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTechnicianSkills, 
  assignSkillToTechnician, 
  removeSkillFromTechnician,
  updateTechnicianSkillProficiency
} from '@/services/technician';

interface TechnicianSkillsManagerProps {
  technician: Technician;
}

const TechnicianSkillsManager: React.FC<TechnicianSkillsManagerProps> = ({ technician }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('1');

  // Fetch all available skills
  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['technicianSkills'],
    queryFn: fetchTechnicianSkills,
  });

  // Get technician's existing skills
  const technicianSkills = technician.skills || [];
  
  // Filter out skills that are already assigned
  const availableSkills = skills?.filter(
    (skill) => !technicianSkills.some((ts) => ts.skill_id === skill.id)
  ) || [];

  const assignSkillMutation = useMutation({
    mutationFn: () => assignSkillToTechnician(
      technician.id,
      selectedSkill,
      Number(proficiencyLevel)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician'] });
      toast({
        title: 'Habilidade adicionada',
        description: 'A habilidade foi adicionada com sucesso.',
      });
      setSelectedSkill('');
      setProficiencyLevel('1');
    },
    onError: (error) => {
      console.error("Error assigning skill:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar a habilidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const removeSkillMutation = useMutation({
    mutationFn: (mappingId: string) => removeSkillFromTechnician(mappingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician'] });
      toast({
        title: 'Habilidade removida',
        description: 'A habilidade foi removida com sucesso.',
      });
    },
    onError: (error) => {
      console.error("Error removing skill:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a habilidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const updateProficiencyMutation = useMutation({
    mutationFn: ({ mappingId, level }: { mappingId: string; level: number }) => 
      updateTechnicianSkillProficiency(mappingId, level),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician'] });
      toast({
        title: 'Nível atualizado',
        description: 'O nível de proficiência foi atualizado.',
      });
    },
    onError: (error) => {
      console.error("Error updating proficiency:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o nível. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const handleAssignSkill = () => {
    if (selectedSkill) {
      assignSkillMutation.mutate();
    }
  };

  const handleRemoveSkill = (mappingId: string) => {
    removeSkillMutation.mutate(mappingId);
  };

  const handleUpdateProficiency = (mappingId: string, level: string) => {
    updateProficiencyMutation.mutate({ 
      mappingId, 
      level: Number(level) 
    });
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i}
        className={`h-4 w-4 ${i < level ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="shadow-md mt-6">
      <CardHeader>
        <CardTitle>Gerenciar Habilidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add new skill */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={selectedSkill}
              onValueChange={setSelectedSkill}
              disabled={isLoadingSkills || availableSkills.length === 0}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Selecionar habilidade" />
              </SelectTrigger>
              <SelectContent>
                {availableSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={proficiencyLevel}
              onValueChange={setProficiencyLevel}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Nível 1 - Básico</SelectItem>
                <SelectItem value="2">Nível 2 - Intermediário</SelectItem>
                <SelectItem value="3">Nível 3 - Avançado</SelectItem>
                <SelectItem value="4">Nível 4 - Proficiente</SelectItem>
                <SelectItem value="5">Nível 5 - Especialista</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleAssignSkill} 
              disabled={!selectedSkill || assignSkillMutation.isPending}
              className="whitespace-nowrap"
            >
              {assignSkillMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </>
              )}
            </Button>
          </div>
          
          {/* Current skills */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Habilidades Atuais</h3>
            {technicianSkills.length === 0 ? (
              <p className="text-muted-foreground text-sm">Nenhuma habilidade adicionada.</p>
            ) : (
              <div className="space-y-3">
                {technicianSkills.map((skillMapping: TechnicianSkillMapping) => (
                  <div key={skillMapping.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-normal">
                        {skillMapping.skill?.name || 'Habilidade desconhecida'}
                      </Badge>
                      <div className="flex">
                        {renderStars(skillMapping.proficiency_level)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={skillMapping.proficiency_level.toString()}
                        onValueChange={(value) => handleUpdateProficiency(skillMapping.id, value)}
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue placeholder="Nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Nível 1</SelectItem>
                          <SelectItem value="2">Nível 2</SelectItem>
                          <SelectItem value="3">Nível 3</SelectItem>
                          <SelectItem value="4">Nível 4</SelectItem>
                          <SelectItem value="5">Nível 5</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSkill(skillMapping.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianSkillsManager;
