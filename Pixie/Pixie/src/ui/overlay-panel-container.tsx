import React from 'react';
import {AnimatePresence} from 'framer-motion';
import {useStore} from '../state/store';
import {HistoryPanel} from '../tools/history/ui/history-panel';
import {NewImageDialogTrigger} from './new-image-dialog';
import {ExportDialogTrigger} from '../tools/export/export-dialog-trigger';
import {ObjListPanel} from '../objects/ui/obj-list-panel';

export function OverlayPanelContainer() {
  const historyVisible = useStore(s => s.openPanels.history);
  const objectsVisible = useStore(s => s.openPanels.objects);
  return (
    <div className="z-modal">
      <AnimatePresence>
        {historyVisible && <HistoryPanel key="historyPanel" />}
        {objectsVisible && <ObjListPanel key="objListPanel" />}
      </AnimatePresence>
      <NewImageDialogTrigger />
      <ExportDialogTrigger />
    </div>
  );
}
