import React, {useContext, useEffect, useMemo} from 'react';
import {Workspace} from './types/workspace';
import {PersonalWorkspace, useUserWorkspaces} from './user-workspaces';
import useCookie from 'react-use-cookie';
import {setActiveWorkspaceId} from './active-workspace-id';

export interface ActiveWorkspaceIdContextValue {
  workspaceId: number | null;
  setWorkspaceId: (id: number) => void;
}

// add default context value so it does not error out, if there's no context provider
export const ActiveWorkspaceIdContext =
  React.createContext<ActiveWorkspaceIdContextValue>({
    // set default as null, so it's not sent via query params in admin and
    // other places if component is not wrapped in workspace context explicitly
    workspaceId: null,
    setWorkspaceId: () => {},
  });

export function useActiveWorkspaceId(): ActiveWorkspaceIdContextValue {
  return useContext(ActiveWorkspaceIdContext);
}

export function useActiveWorkspace(): Workspace | null | undefined {
  const {workspaceId} = useActiveWorkspaceId();
  const query = useUserWorkspaces();
  if (query.data) {
    return query.data.find(workspace => workspace.id === workspaceId);
  }
  return null;
}

interface ActiveWorkspaceProviderProps {
  children: any;
}
export function ActiveWorkspaceProvider({
  children,
}: ActiveWorkspaceProviderProps) {
  const [workspaceId, setCookieId] = useCookie(
    'activeWorkspaceId',
    `${PersonalWorkspace.id}`
  );

  useEffect(() => {
    setActiveWorkspaceId(parseInt(workspaceId));
    // clear workspace id when unmounting workspace provider
    return () => {
      setActiveWorkspaceId(0);
    };
  }, [workspaceId]);

  const contextValue: ActiveWorkspaceIdContextValue = useMemo(() => {
    return {
      workspaceId: parseInt(workspaceId),
      setWorkspaceId: (id: number) => {
        setCookieId(`${id}`);
      },
    };
  }, [workspaceId, setCookieId]);

  return (
    <ActiveWorkspaceIdContext.Provider value={contextValue}>
      {children}
    </ActiveWorkspaceIdContext.Provider>
  );
}
