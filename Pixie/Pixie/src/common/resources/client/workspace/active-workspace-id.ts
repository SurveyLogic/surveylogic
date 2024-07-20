// store this in a separate file, to avoid importing query client and axios in pixie

let activeWorkspaceId = 0;

// for access outside react
export function getActiveWorkspaceId() {
  return activeWorkspaceId;
}

export function setActiveWorkspaceId(id: number) {
  activeWorkspaceId = id;
}
