import memoize from 'nano-memoize';
import {MessageDescriptor} from './message-descriptor';

// this will get memoized by enclosing function (<Trans> or useTrans)
export function handlePluralMessage(
  localeCode: string,
  {message, values}: MessageDescriptor
): string {
  // find plural config e.g. [one 1 item|other :count items]
  const match = message.match(/\[(.+?)]/);
  const count = values?.count;
  if (match && match[1] && !Number.isNaN(count)) {
    // get config without brackets and split by pipe e.g. [one 1 item, other :count items]
    const [pluralPlaceholder, pluralConfig] = match;
    const choices = pluralConfig.split('|');
    if (!choices.length) return message;

    // use Intl.PluralRules to determine which choice to use, based on special "count" value
    const rules = getRules(localeCode);
    const choiceName = rules.select(count as number);

    // find the correct choice from config, or use first one
    let choiceConfig = choices.find(c => {
      return c.startsWith(choiceName);
    });
    if (!choiceConfig) {
      choiceConfig = choices[0];
    }

    // get rid of plural prefix e.g. one 1 item => 1 item
    const choice = choiceConfig.substring(choiceConfig.indexOf(' ') + 1);

    return message.replace(pluralPlaceholder, choice);
  }
  return message;
}

const getRules = memoize((localeCode: string) => {
  return new Intl.PluralRules(localeCode);
});
