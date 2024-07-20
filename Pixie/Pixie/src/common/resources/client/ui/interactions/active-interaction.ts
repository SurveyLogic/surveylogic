type InteractionName = null | 'resize' | 'rotate' | 'drag' | 'move';

export let activeInteraction: InteractionName = null;

export function setActiveInteraction(name: InteractionName) {
  activeInteraction = name;
}
