import {ReactNode} from 'react';

interface BillingPlanPanelProps {
  title: ReactNode;
  children: ReactNode;
}
export function BillingPlanPanel({title, children}: BillingPlanPanelProps) {
  return (
    <div className="mb-64">
      <div className="text-sm font-medium uppercase pb-16 mb-16 border-b">
        {title}
      </div>
      {children}
    </div>
  );
}
