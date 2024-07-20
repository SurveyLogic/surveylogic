export interface Frame {
    name: string;
    display_name?: string;
    mode: 'repeat' | 'stretch' | 'basic';
    size: {
        min: number;
        default: number;
        max: number;
    };
}
