export enum Permission {
  viewAllSessions = 'VIEW_ALL_SESSIONS',
  editSessionsCoach = 'EDIT_SESSION_COACH',
  closeAllSessions = 'CLOSE_ALL_SESSIONS', // --
  closeLateSessions = 'CLOSE_LATE_SESSIONS',
  registerAllSessionAbsence = 'REGISTER_ALL_SESSION_ABSENCE', // --
  createClient = 'CREATE_CLIENT',
  editClient = 'EDIT_CLIENT',
  archiveClient = 'ARCHIVE_CLIENT',
  createEvaluation = 'CREATE_EVALUATION',
  editEvaluation = 'EDIT_EVALUATION',
  exportClientDetails = 'EXPORT_CLIENT_DETAILS',
  viewCoachSection = 'VIEW_COACH_SECTION',
  createEmployee = 'CREATE_EMPLOYEE',
  editEmployee = 'EDIT_EMPLOYEE',
  archiveEmployee = 'ARCHIVE_EMPLOYEE',
  filterSessionByCoach = 'FILTER_SESSION_BY_COACH',
  managePermissions = 'MANAGE_PERMISSIONS'
}
