// Type stub for `@dataconnect/generated`.
//
// When you run `firebase dataconnect:sdk:generate` this file is replaced
// with strongly typed definitions matching your GraphQL operations.
// Until then we expose everything as `any` so the app still compiles.

export const connectorConfig: { connector: string; service: string; location: string; __stub?: boolean };
export const __stub: boolean;

type AnyArgs = unknown[];
type DataResult<T = unknown> = Promise<{ data: T | null; __stub?: boolean }>;
type AnyRef = { name: string; __stub?: boolean };

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createCurrentUser(...args: AnyArgs): DataResult<any>;
export function createCurrentUserRef(...args: AnyArgs): AnyRef;
export function updateUserRole(...args: AnyArgs): DataResult<any>;
export function updateUserRoleRef(...args: AnyArgs): AnyRef;
export function getCurrentUser(...args: AnyArgs): DataResult<any>;
export function getCurrentUserRef(...args: AnyArgs): AnyRef;
export function listAdvisors(...args: AnyArgs): DataResult<any>;
export function listAdvisorsRef(...args: AnyArgs): AnyRef;

export function createParticipant(...args: AnyArgs): DataResult<any>;
export function createParticipantRef(...args: AnyArgs): AnyRef;
export function updateParticipantStatus(...args: AnyArgs): DataResult<any>;
export function updateParticipantStatusRef(...args: AnyArgs): AnyRef;
export function assignAdvisor(...args: AnyArgs): DataResult<any>;
export function assignAdvisorRef(...args: AnyArgs): AnyRef;
export function updateParticipantPathway(...args: AnyArgs): DataResult<any>;
export function updateParticipantPathwayRef(...args: AnyArgs): AnyRef;
export function flagParticipantRisk(...args: AnyArgs): DataResult<any>;
export function flagParticipantRiskRef(...args: AnyArgs): AnyRef;
export function linkCurrentUserToParticipant(...args: AnyArgs): DataResult<any>;
export function linkCurrentUserToParticipantRef(...args: AnyArgs): AnyRef;
export function getMyParticipant(...args: AnyArgs): DataResult<any>;
export function getMyParticipantRef(...args: AnyArgs): AnyRef;
export function listAllParticipants(...args: AnyArgs): DataResult<any>;
export function listAllParticipantsRef(...args: AnyArgs): AnyRef;
export function listParticipantsByAdvisor(...args: AnyArgs): DataResult<any>;
export function listParticipantsByAdvisorRef(...args: AnyArgs): AnyRef;
export function listParticipantsByStatus(...args: AnyArgs): DataResult<any>;
export function listParticipantsByStatusRef(...args: AnyArgs): AnyRef;
export function getParticipant(...args: AnyArgs): DataResult<any>;
export function getParticipantRef(...args: AnyArgs): AnyRef;
export function getParticipantDetail(...args: AnyArgs): DataResult<any>;
export function getParticipantDetailRef(...args: AnyArgs): AnyRef;

export function createApplication(...args: AnyArgs): DataResult<any>;
export function createApplicationRef(...args: AnyArgs): AnyRef;
export function listApplications(...args: AnyArgs): DataResult<any>;
export function listApplicationsRef(...args: AnyArgs): AnyRef;

export function createReferral(...args: AnyArgs): DataResult<any>;
export function createReferralRef(...args: AnyArgs): AnyRef;
export function updateReferralStatus(...args: AnyArgs): DataResult<any>;
export function updateReferralStatusRef(...args: AnyArgs): AnyRef;
export function linkReferralToParticipant(...args: AnyArgs): DataResult<any>;
export function linkReferralToParticipantRef(...args: AnyArgs): AnyRef;
export function listReferrals(...args: AnyArgs): DataResult<any>;
export function listReferralsRef(...args: AnyArgs): AnyRef;

export function createAppointment(...args: AnyArgs): DataResult<any>;
export function createAppointmentRef(...args: AnyArgs): AnyRef;
export function updateAppointmentStatus(...args: AnyArgs): DataResult<any>;
export function updateAppointmentStatusRef(...args: AnyArgs): AnyRef;
export function linkAppointment(...args: AnyArgs): DataResult<any>;
export function linkAppointmentRef(...args: AnyArgs): AnyRef;
export function listMyAppointments(...args: AnyArgs): DataResult<any>;
export function listMyAppointmentsRef(...args: AnyArgs): AnyRef;
export function listAllAppointments(...args: AnyArgs): DataResult<any>;
export function listAllAppointmentsRef(...args: AnyArgs): AnyRef;

export function createTask(...args: AnyArgs): DataResult<any>;
export function createTaskRef(...args: AnyArgs): AnyRef;
export function updateTaskStatus(...args: AnyArgs): DataResult<any>;
export function updateTaskStatusRef(...args: AnyArgs): AnyRef;
export function createNote(...args: AnyArgs): DataResult<any>;
export function createNoteRef(...args: AnyArgs): AnyRef;
export function createDocument(...args: AnyArgs): DataResult<any>;
export function createDocumentRef(...args: AnyArgs): AnyRef;
export function updateDocumentStatus(...args: AnyArgs): DataResult<any>;
export function updateDocumentStatusRef(...args: AnyArgs): AnyRef;
export function sendMessage(...args: AnyArgs): DataResult<any>;
export function sendMessageRef(...args: AnyArgs): AnyRef;
export function markMessageRead(...args: AnyArgs): DataResult<any>;
export function markMessageReadRef(...args: AnyArgs): AnyRef;
export function listMyDocuments(...args: AnyArgs): DataResult<any>;
export function listMyDocumentsRef(...args: AnyArgs): AnyRef;
export function listMyMessages(...args: AnyArgs): DataResult<any>;
export function listMyMessagesRef(...args: AnyArgs): AnyRef;
export function listParticipantMessages(...args: AnyArgs): DataResult<any>;
export function listParticipantMessagesRef(...args: AnyArgs): AnyRef;

export function adminOverview(...args: AnyArgs): DataResult<any>;
export function adminOverviewRef(...args: AnyArgs): AnyRef;
