// Stub for removed Prisma - migrate to services/api
// These functions should be replaced with API calls to services/api

export async function getUser(name: string, withPassword = false) {
  console.warn("getUser: migrate to services/api");
  return null;
}

export async function createUser(name: string) {
  console.warn("createUser: migrate to services/api");
  return null;
}

export async function createList(name: string) {
  console.warn("createList: migrate to services/api");
  return null;
}

export async function getEpisode(id: string) {
  console.warn("getEpisode: migrate to services/api");
  return null;
}

export async function getAllUsers() {
  console.warn("getAllUsers: migrate to services/api");
  return [];
}

export async function getDb() {
  console.warn("getDb: migrate to services/api");
  return null;
}

export async function deleteUser(name: string) {
  console.warn("deleteUser: migrate to services/api");
  return null;
}

export async function updateUser(name: string, data: any) {
  console.warn("updateUser: migrate to services/api");
  return null;
}

export async function getRemovedMedia() {
  return [];
}

export async function deleteEpisode(id: string) {
  console.warn("deleteEpisode: migrate to services/api");
  return null;
}

export async function deleteList(id: string) {
  console.warn("deleteList: migrate to services/api");
  return null;
}

export async function updateUserEpisode(episodeId: string, data: any) {
  console.warn("updateUserEpisode: migrate to services/api");
  return null;
}
