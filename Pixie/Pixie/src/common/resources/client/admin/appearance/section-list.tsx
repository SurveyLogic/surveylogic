import {NavLink} from 'react-router-dom';
import {AppearanceButton} from './appearance-button';
import {useAppearanceStore} from './appearance-store';
import {Trans} from '../../i18n/trans';
import {Fragment, useMemo} from 'react';

export function SectionList() {
  const sections = useAppearanceStore(s => s.config?.sections);
  const sortedSection = useMemo(() => {
    if (!sections) return [];
    return Object.entries(sections || [])
      .map(([key, value]) => {
        return {
          ...value,
          key,
        };
      })
      .sort((a, b) => (a?.position || 1) - (b?.position || 1));
  }, [sections]);

  return (
    <Fragment>
      {sortedSection.map(section => {
        return (
          <AppearanceButton
            key={section.key}
            to={section.key}
            elementType={NavLink}
          >
            <Trans {...section.label} />
          </AppearanceButton>
        );
      })}
    </Fragment>
  );
}
