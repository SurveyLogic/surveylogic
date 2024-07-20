import {CheckIcon} from '@common/icons/material/Check';
import {CloseIcon} from '@common/icons/material/Close';
import React from 'react';

interface BooleanIndicatorProps {
  value: boolean;
}
export function BooleanIndicator({value}: BooleanIndicatorProps) {
  if (value) {
    return <CheckIcon className="icon-md text-positive" />;
  }
  return <CloseIcon className="icon-md text-danger" />;
}
