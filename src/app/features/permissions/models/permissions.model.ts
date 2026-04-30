import { Permission } from '../../authentication/models/permissions.model';

export interface PermissionToggle {
  value: Permission;
  isActive: boolean;
}

export const PermissionsLabels: Record<Permission, string> = {
  [Permission.viewAllSessions]: 'Ver todas as sessões',
  [Permission.editSessionsCoach]: 'Editar treinador das sessões',
  [Permission.closeAllSessions]: 'Fechar todas as sessões',
  [Permission.closeLateSessions]: 'Fechar sessões após a hora',
  [Permission.registerAllSessionAbsence]: 'Registar faltas em todos os colaboradores',
  [Permission.createClient]: 'Criar cliente',
  [Permission.editClient]: 'Editar cliente',
  [Permission.archiveClient]: 'Arquivar cliente',
  [Permission.createEvaluation]: 'Criar avaliação',
  [Permission.editEvaluation]: 'Editar avaliação',
  [Permission.exportClientDetails]: 'Exportar PDF do cliente',
  [Permission.viewCoachSection]: 'Ver a página de equipa',
  [Permission.createEmployee]: 'Criar colaborador',
  [Permission.editEmployee]: 'Editar colaborador',
  [Permission.archiveEmployee]: 'Arquivar colaborador',
  [Permission.filterSessionByCoach]: 'Filtrar as sessões por treinador',
  [Permission.managePermissions]: 'Gerir permissões'
};
