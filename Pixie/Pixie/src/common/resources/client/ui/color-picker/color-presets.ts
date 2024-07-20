import {message} from '@common/i18n/message';
import {MessageDescriptor} from '@common/i18n/message-descriptor';

export const ColorPresets: {
  color: string;
  name: MessageDescriptor;
  foreground?: string;
}[] = [
  {
    color: 'rgb(255, 255, 255)',
    name: message('White'),
  },
  {
    color: 'rgb(239,245,245)',
    name: message('Solitude'),
  },
  {
    color: 'rgb(245,213,174)',
    name: message('Wheat'),
  },
  {
    color: 'rgb(253,227,167)',
    name: message('Cape Honey'),
  },
  {
    color: 'rgb(242,222,186)',
    name: message('Milk punch'),
  },
  {
    color: 'rgb(97,118,75)',
    name: message('Dingy'),
    foreground: 'rgb(255, 255, 255)',
  },
  {
    color: 'rgb(4, 147, 114)',
    name: message('Aquamarine'),
    foreground: 'rgb(255, 255, 255)',
  },
  {
    color: 'rgb(222,245,229)',
    name: message('Cosmic Latte'),
  },
  {
    color: 'rgb(233,119,119)',
    name: message('Geraldine'),
    foreground: 'rgb(90,14,14)',
  },
  {
    color: 'rgb(247,164,164)',
    name: message('Sundown'),
  },
  {
    color: 'rgb(30,139,195)',
    name: message('Pelorous'),
    foreground: 'rgb(255, 255, 255)',
  },
  {
    color: 'rgb(142,68,173)',
    name: message('Deep Lilac'),
    foreground: 'rgb(255, 255, 255)',
  },
  {
    color: 'rgb(108,74,182)',
    name: message('Blue marguerite'),
    foreground: 'rgb(255, 255, 255)',
  },
  {
    color: 'rgb(139,126,116)',
    name: message('Americano'),
    foreground: 'rgb(255, 255, 255)',
  },
  {
    color: 'rgb(0,0,0)',
    name: message('Black'),
    foreground: 'rgb(255, 255, 255)',
  },
  {
    color: 'rgb(64,66,88)',
    name: message('Blue zodiac'),
    foreground: 'rgb(255, 255, 255)',
  },
  {
    color: 'rgb(101,100,124)',
    name: message('Comet'),
    foreground: 'rgb(255, 255, 255)',
  },
];
