import {useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {AllCommands} from './commands';
import {setThemeColor} from '../../../ui/themes/utils/set-theme-color';
import {applyThemeToDom} from '../../../ui/themes/utils/apply-theme-to-dom';
import {useBootstrapData} from '../../../core/bootstrap-data/bootstrap-data-context';

export function AppearanceListener() {
  const navigate = useNavigate();
  const {mergeBootstrapData, data: currentData} = useBootstrapData();

  const handleCommand = useCallback(
    (command: AllCommands) => {
      switch (command.type) {
        case 'navigate':
          return navigate(command.to);
        case 'setValues':
          return mergeBootstrapData({
            themes: {
              ...currentData.themes,
              all: command.values.appearance.themes.all,
            },
            settings: {
              ...currentData.settings,
              ...command.values.settings,
            },
          });
        case 'setThemeColor':
          return setThemeColor(command.name, command.value);
        case 'setActiveTheme':
          const theme = currentData.themes.all.find(
            t => t.id === command.themeId
          );
          if (theme) {
            applyThemeToDom(theme);
          }
          return;
        case 'setCustomCode':
          return renderCustomCode(command.mode, command.value);
        default:
      }
    },
    [currentData, mergeBootstrapData, navigate]
  );

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (isAppearanceEvent(e) && eventIsTrusted(e)) {
        handleCommand(e.data);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, handleCommand]);
  return null;
}

function isAppearanceEvent(e: MessageEvent) {
  return e.data?.source === 'be-appearance-editor';
}

function eventIsTrusted(e: MessageEvent): boolean {
  return new URL(e.origin).hostname === window.location.hostname;
}

function renderCustomCode(mode: 'html' | 'css', value?: string) {
  const parent = mode === 'html' ? document.body : document.head;
  const nodeType = mode === 'html' ? 'div' : 'style';
  let customNode = parent.querySelector('#be-custom-code');

  if (!value) {
    if (customNode) {
      customNode.remove();
    }
  } else {
    if (!customNode) {
      customNode = document.createElement(nodeType);
      customNode.id = 'be-custom-code';
      parent.appendChild(customNode);
    }
    customNode.innerHTML = value;
  }
}
