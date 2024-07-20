import {ConfirmationDialog} from '../ui/overlays/dialog/confirmation-dialog';
import {Trans} from '../i18n/trans';

export function LeaveWorkspaceConfirmation() {
  return (
    <ConfirmationDialog
      isDanger
      title={<Trans message="Leave workspace" />}
      body={
        <div>
          <Trans message="Are you sure you want to leave this workspace?" />
          <div className="font-semibold mt-8">
            <Trans message="All resources you've created in the workspace will be transferred to workspace owner." />
          </div>
        </div>
      }
      confirm={<Trans message="Leave" />}
    />
  );
}
