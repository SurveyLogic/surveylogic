export function useAppearanceEditorMode() {
  return {
    isAppearanceEditorActive: (
      (window.frameElement as HTMLIFrameElement) || undefined
    )?.src.includes('appearanceEditor=true'),
  };
}
