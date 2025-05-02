
// Re-export all technician service functions from a single entry point
import { 
  fetchTechnicians, 
  fetchTechnicianById,
  createTechnician, 
  updateTechnician, 
  deleteTechnician,
  countActiveTechnicians,
  fetchActiveTechnicians,
  fetchTechniciansWithFilters
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

import {
  fetchTechnicianByEmail,
  getCurrentTechnician
} from './technicianAuth';

export {
  // Core technician operations
  fetchTechnicians,
  fetchTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  countActiveTechnicians,
  fetchActiveTechnicians,
  fetchTechniciansWithFilters,
  
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
  calculateTechnicianPerformance,
  
  // Auth related
  fetchTechnicianByEmail,
  getCurrentTechnician
};
