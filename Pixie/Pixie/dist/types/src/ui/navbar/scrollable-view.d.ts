import React from 'react';
type ScrollableListProps = {
    children: React.ReactNode;
    className?: string;
    gap?: string;
};
export declare const ScrollableView: React.ForwardRefExoticComponent<ScrollableListProps & React.RefAttributes<HTMLDivElement>>;
export type ScrollableListItemProps = {
    children: React.ReactNode;
    className?: string;
    isFirst?: boolean;
    isLast?: boolean;
};
export declare function ScrollableViewItem({ isFirst, isLast, children, className, }: ScrollableListItemProps): import("react/jsx-runtime").JSX.Element;
export {};
