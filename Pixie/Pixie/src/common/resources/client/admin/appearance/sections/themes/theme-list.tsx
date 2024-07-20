import {NavLink, useNavigate} from 'react-router-dom';
import {Fragment, useEffect} from 'react';
import {appearanceState, AppearanceValues} from '../../appearance-store';
import {AppearanceButton} from '../../appearance-button';
import {Button} from '../../../../ui/buttons/button';
import {AddIcon} from '../../../../icons/material/Add';
import {randomNumber} from '../../../../utils/string/random-number';
import {Trans} from '../../../../i18n/trans';
import {useFieldArray} from 'react-hook-form';
import {useTrans} from '../../../../i18n/use-trans';
import {message} from '../../../../i18n/message';
import {useBootstrapData} from '../../../../core/bootstrap-data/bootstrap-data-context';

export function ThemeList() {
  const {trans} = useTrans();
  const navigate = useNavigate();
  const {
    data: {themes},
  } = useBootstrapData();
  const {fields, append} = useFieldArray<
    AppearanceValues,
    'appearance.themes.all',
    'key'
  >({
    name: 'appearance.themes.all',
    keyName: 'key',
  });

  useEffect(() => {
    if (themes.selectedThemeId) {
      appearanceState().preview.setActiveTheme(themes.selectedThemeId);
    }
  }, [themes.selectedThemeId]);

  return (
    <Fragment>
      <div className="mb-20">
        <Button
          size="xs"
          variant="outline"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            const lightThemeColors =
              appearanceState().defaults?.appearance.themes.light!;
            append({
              id: randomNumber(),
              name: trans(message('New theme')),
              colors: lightThemeColors,
            });
            navigate(`${fields.length + 1}`);
          }}
        >
          <Trans message="New theme" />
        </Button>
      </div>
      {fields.map((field, index) => (
        <AppearanceButton key={field.key} to={`${index}`} elementType={NavLink}>
          {field.name}
        </AppearanceButton>
      ))}
    </Fragment>
  );
}
