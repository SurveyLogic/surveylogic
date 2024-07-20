export interface ToolSlice {
    apply?: () => Promise<void | false> | false | undefined;
    reset: () => void;
}
