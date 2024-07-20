import React from 'react';
import {ProgressBarBase, ProgressBarBaseProps} from './progress-bar-base';

export function Meter(props: ProgressBarBaseProps) {
  return <ProgressBarBase {...props} role="meter progressbar" />;
}
