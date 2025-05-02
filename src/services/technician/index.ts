
// Re-export all technician service functions from a single entry point
import { 
  fetchTechnicians, 
  fetchTechnicianById,
  createTechnician, 
  updateTechnician, 
  deleteTechnician,
  countActiveTechnicians,
  fetchActiveTechnicians
} from './technicianCore';

import {
  fetchTechnicianSkills,
  fetchTechnicianSkillById,
  createTechnicianSkill,
  updateTechnicianSkill,
  deleteTechnicianSkill
} from './technicianSkills';

import {
  assignSkillToTechnician,
  removeSkillFromTechnician,
  updateTechnicianSkillProficiency,
  fetchTechnicianSkillMappings
} from './technicianSkillMappings';

import {
  fetchTechnicianAvailability,
  setTechnicianAvailability,
  updateTechnicianAvailability
} from './technicianAvailability';

import {
  fetchTechnicianPerformance,
  calculateTechnicianPerformance
} from './technicianPerformance';

export {
  // Core technician operations
  fetchTechnicians,
  fetchTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  countActiveTechnicians,
  fetchActiveTechnicians,
  
  // Skills management
  fetchTechnicianSkills,
  fetchTechnicianSkillById,
  createTechnicianSkill,
  updateTechnicianSkill,
  deleteTechnicianSkill,
  
  // Skill mappings
  assignSkillToTechnician,
  removeSkillFromTechnician,
  updateTechnicianSkillProficiency,
  fetchTechnicianSkillMappings,
  
  // Availability management
  fetchTechnicianAvailability,
  setTechnicianAvailability,
  updateTechnicianAvailability,
  
  // Performance metrics
  fetchTechnicianPerformance,
  calculateTechnicianPerformance
};
