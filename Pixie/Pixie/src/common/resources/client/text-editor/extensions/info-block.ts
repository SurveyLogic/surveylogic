import {mergeAttributes, Node} from '@tiptap/react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    important: {
      addInfo: (attributes: {
        type: 'important' | 'warning' | 'success';
      }) => ReturnType;
    };
  }
}

export const InfoBlock = Node.create({
  name: 'be-info-block',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'success',
        renderHTML: attrs => {
          return {class: attrs.type};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: node =>
          (node as HTMLElement).classList.contains('info-block') && null,
      },
    ];
  },

  renderHTML({HTMLAttributes}) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'info-block',
      }),
      ['div', {class: 'title'}, 'Important:'],
      ['p', 0],
    ];
  },

  addCommands() {
    return {
      addInfo:
        attributes =>
        ({commands}) => {
          return commands.setNode(this.name, attributes);
        },
    };
  },
});
