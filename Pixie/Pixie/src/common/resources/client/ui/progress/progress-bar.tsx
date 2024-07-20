import React from 'react';
import {ProgressBarBase, ProgressBarBaseProps} from './progress-bar-base';

interface Props extends ProgressBarBaseProps {
  isIndeterminate?: boolean;
}

export function ProgressBar(props: Props) {
  return <ProgressBarBase {...props} />;
}
