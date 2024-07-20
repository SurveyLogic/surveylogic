import { ReactElement } from 'react';
import type { MenubarItemProps } from './toolbar-item';
interface DropdownButtonProps extends MenubarItemProps {
    button: ReactElement;
}
export declare function DropdownButton({ item, button }: DropdownButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
