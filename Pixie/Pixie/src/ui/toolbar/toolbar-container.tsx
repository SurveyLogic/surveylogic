import {AnimatePresence} from 'framer-motion';
import {useStore} from '../../state/store';
import {MainToolbar} from './main-toolbar';
import {ActiveToolbar} from './active-toolbar';

export function ToolbarContainer() {
  const activeTool = useStore(s => s.activeTool);

  return (
    <AnimatePresence initial={false}>
      {activeTool ? (
        <ActiveToolbar key="activeToolbar" />
      ) : (
        <MainToolbar key="mainToolbar" />
      )}
    </AnimatePresence>
  );
}
