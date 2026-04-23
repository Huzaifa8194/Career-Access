/* eslint-disable */
// Stub for `@dataconnect/generated`.
//
// When you run:
//   firebase dataconnect:sdk:generate
// this file is overwritten with a real, typed Data Connect SDK driven
// by `dataconnect/connector/queries.gql` and `mutations.gql`.
//
// Until then, every generated function is a no-op that returns empty data.
// The app detects this and falls back to demo content in `lib/data.ts` so
// the UI stays functional without a running backend.

const STUB = true;

const connectorConfig = {
  connector: "career-access",
  service: "career-access",
  location: "us-central1",
  __stub: true,
};

function emptyQuery() {
  return Promise.resolve({ data: null, __stub: true });
}

function emptyInsert(name) {
  return Promise.resolve({ data: { [name + "_insert"]: { id: "__stub__" } }, __stub: true });
}

function emptyUpdate() {
  return Promise.resolve({ data: null, __stub: true });
}

const refFactory = (name) => () => ({ name, __stub: true });

module.exports = {
  __stub: STUB,
  connectorConfig,

  // ---- Users ------------------------------------------------------------
  createCurrentUser: () => emptyInsert("user"),
  createCurrentUserRef: refFactory("CreateCurrentUser"),
  updateUserRole: () => emptyUpdate(),
  updateUserRoleRef: refFactory("UpdateUserRole"),
  getCurrentUser: () => emptyQuery(),
  getCurrentUserRef: refFactory("GetCurrentUser"),
  listAdvisors: () => emptyQuery(),
  listAdvisorsRef: refFactory("ListAdvisors"),

  // ---- Participants -----------------------------------------------------
  createParticipant: () => emptyInsert("participant"),
  createParticipantRef: refFactory("CreateParticipant"),
  updateParticipantStatus: () => emptyUpdate(),
  updateParticipantStatusRef: refFactory("UpdateParticipantStatus"),
  assignAdvisor: () => emptyUpdate(),
  assignAdvisorRef: refFactory("AssignAdvisor"),
  updateParticipantPathway: () => emptyUpdate(),
  updateParticipantPathwayRef: refFactory("UpdateParticipantPathway"),
  flagParticipantRisk: () => emptyUpdate(),
  flagParticipantRiskRef: refFactory("FlagParticipantRisk"),
  linkCurrentUserToParticipant: () => emptyUpdate(),
  linkCurrentUserToParticipantRef: refFactory("LinkCurrentUserToParticipant"),
  getMyParticipant: () => emptyQuery(),
  getMyParticipantRef: refFactory("GetMyParticipant"),
  listAllParticipants: () => emptyQuery(),
  listAllParticipantsRef: refFactory("ListAllParticipants"),
  listParticipantsByAdvisor: () => emptyQuery(),
  listParticipantsByAdvisorRef: refFactory("ListParticipantsByAdvisor"),
  listParticipantsByStatus: () => emptyQuery(),
  listParticipantsByStatusRef: refFactory("ListParticipantsByStatus"),
  getParticipant: () => emptyQuery(),
  getParticipantRef: refFactory("GetParticipant"),
  getParticipantDetail: () => emptyQuery(),
  getParticipantDetailRef: refFactory("GetParticipantDetail"),

  // ---- Applications -----------------------------------------------------
  createApplication: () => emptyInsert("application"),
  createApplicationRef: refFactory("CreateApplication"),
  listApplications: () => emptyQuery(),
  listApplicationsRef: refFactory("ListApplications"),

  // ---- Referrals --------------------------------------------------------
  createReferral: () => emptyInsert("referral"),
  createReferralRef: refFactory("CreateReferral"),
  updateReferralStatus: () => emptyUpdate(),
  updateReferralStatusRef: refFactory("UpdateReferralStatus"),
  linkReferralToParticipant: () => emptyUpdate(),
  linkReferralToParticipantRef: refFactory("LinkReferralToParticipant"),
  listReferrals: () => emptyQuery(),
  listReferralsRef: refFactory("ListReferrals"),

  // ---- Appointments -----------------------------------------------------
  createAppointment: () => emptyInsert("appointment"),
  createAppointmentRef: refFactory("CreateAppointment"),
  updateAppointmentStatus: () => emptyUpdate(),
  updateAppointmentStatusRef: refFactory("UpdateAppointmentStatus"),
  linkAppointment: () => emptyUpdate(),
  linkAppointmentRef: refFactory("LinkAppointment"),
  listMyAppointments: () => emptyQuery(),
  listMyAppointmentsRef: refFactory("ListMyAppointments"),
  listAllAppointments: () => emptyQuery(),
  listAllAppointmentsRef: refFactory("ListAllAppointments"),

  // ---- Tasks / Notes / Documents / Messages -----------------------------
  createTask: () => emptyInsert("task"),
  createTaskRef: refFactory("CreateTask"),
  updateTaskStatus: () => emptyUpdate(),
  updateTaskStatusRef: refFactory("UpdateTaskStatus"),
  listTasksForParticipant: () => emptyQuery(),
  listTasksForParticipantRef: refFactory("ListTasksForParticipant"),
  listOpenTasks: () => emptyQuery(),
  listOpenTasksRef: refFactory("ListOpenTasks"),
  listMyTasks: () => emptyQuery(),
  listMyTasksRef: refFactory("ListMyTasks"),
  createNote: () => emptyInsert("note"),
  createNoteRef: refFactory("CreateNote"),
  createDocument: () => emptyInsert("document"),
  createDocumentRef: refFactory("CreateDocument"),
  updateDocumentStatus: () => emptyUpdate(),
  updateDocumentStatusRef: refFactory("UpdateDocumentStatus"),
  sendMessage: () => emptyInsert("message"),
  sendMessageRef: refFactory("SendMessage"),
  markMessageRead: () => emptyUpdate(),
  markMessageReadRef: refFactory("MarkMessageRead"),
  listMyDocuments: () => emptyQuery(),
  listMyDocumentsRef: refFactory("ListMyDocuments"),
  listMyMessages: () => emptyQuery(),
  listMyMessagesRef: refFactory("ListMyMessages"),
  listParticipantMessages: () => emptyQuery(),
  listParticipantMessagesRef: refFactory("ListParticipantMessages"),

  // ---- Admin ------------------------------------------------------------
  adminOverview: () => emptyQuery(),
  adminOverviewRef: refFactory("AdminOverview"),
};
