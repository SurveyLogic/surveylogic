import {Fragment, memo} from 'react';
import {useTrans, UseTransReturn} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';

interface ParsedMS {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FormattedTrackDurationProps {
  ms?: number;
  minutes?: number;
  seconds?: number;
  verbose?: boolean;
  addZeroToFirstUnit?: boolean;
}
export const FormattedDuration = memo(
  ({
    minutes,
    seconds,
    ms,
    verbose = false,
    addZeroToFirstUnit = true,
  }: FormattedTrackDurationProps) => {
    const {trans} = useTrans();

    if (minutes) {
      ms = minutes * 60000;
    } else if (seconds) {
      ms = seconds * 1000;
    }
    if (!ms) {
      ms = 0;
    }

    const unsignedMs = ms < 0 ? -ms : ms;
    const parsedMS: ParsedMS = {
      days: Math.trunc(unsignedMs / 86400000),
      hours: Math.trunc(unsignedMs / 3600000) % 24,
      minutes: Math.trunc(unsignedMs / 60000) % 60,
      seconds: Math.trunc(unsignedMs / 1000) % 60,
    };

    let formattedValue: string;
    if (verbose) {
      formattedValue = formatVerbose(parsedMS, trans);
    } else {
      formattedValue = formatCompact(parsedMS, addZeroToFirstUnit);
    }

    return <Fragment>{formattedValue}</Fragment>;
  }
);

function formatVerbose(t: ParsedMS, trans: UseTransReturn['trans']) {
  const output: string[] = [];

  if (t.days) {
    output.push(`${t.days}${trans(message('d'))}`);
  }
  if (t.hours) {
    output.push(`${t.hours}${trans(message('hr'))}`);
  }
  if (t.minutes) {
    output.push(`${t.minutes}${trans(message('min'))}`);
  }
  if (t.seconds && !t.hours) {
    output.push(`${t.seconds}${trans(message('sec'))}`);
  }

  return output.join(' ');
}

function formatCompact(t: ParsedMS, addZeroToFirstUnit = true) {
  const seconds = addZero(t.seconds);
  let output = '';
  if (t.days && !output) {
    output = `${t.days}:${addZero(t.hours)}:${addZero(t.minutes)}:${seconds}`;
  }
  if (t.hours && !output) {
    output = `${addZero(t.hours, addZeroToFirstUnit)}:${addZero(
      t.minutes
    )}:${seconds}`;
  }
  if (!output) {
    output = `${addZero(t.minutes, addZeroToFirstUnit)}:${seconds}`;
  }
  return output;
}

function addZero(v: number, addZero = true) {
  if (!addZero) return v;
  let value = `${v}`;
  if (value.length === 1) {
    value = '0' + value;
  }
  return value;
}
