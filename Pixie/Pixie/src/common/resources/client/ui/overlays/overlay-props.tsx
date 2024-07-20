import {
  CSSProperties,
  PointerEventHandler,
  ReactElement,
  Ref,
  RefObject,
} from 'react';
import {FocusScopeProps} from '@react-aria/focus';
import {VirtualElement} from '@floating-ui/react-dom';

export interface OverlayProps
  extends Omit<FocusScopeProps, 'children' | 'contain'> {
  children: ReactElement;
  style?: CSSProperties;
  isDismissable: boolean;
  isContextMenu?: boolean;
  isOpen: boolean;
  onClose: (value?: any) => void;
  triggerRef: RefObject<HTMLElement> | RefObject<VirtualElement>;
  arrowRef?: Ref<HTMLElement>;
  arrowStyle?: CSSProperties;
  onPointerLeave?: PointerEventHandler<HTMLElement>;
  onPointerEnter?: PointerEventHandler<HTMLElement>;
}
