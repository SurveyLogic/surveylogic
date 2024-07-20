import {Link, useNavigate} from 'react-router-dom';
import {AppearanceValues} from '../../appearance-store';
import {Button} from '../../../../ui/buttons/button';
import {AddIcon} from '../../../../icons/material/Add';
import {Trans} from '../../../../i18n/trans';
import {useFieldArray} from 'react-hook-form';
import {AppearanceButton} from '../../appearance-button';
import {nanoid} from 'nanoid';
import {useTrans} from '../../../../i18n/use-trans';
import {message} from '../../../../i18n/message';
import {Fragment} from 'react';

export function MenuList() {
  const navigate = useNavigate();
  const {trans} = useTrans();
  const {fields, append} = useFieldArray<
    AppearanceValues,
    'settings.menus',
    'key'
  >({
    name: 'settings.menus',
    keyName: 'key',
  });

  return (
    <Fragment>
      <div>
        {fields.map((field, index) => (
          <AppearanceButton to={`${index}`} key={field.key} elementType={Link}>
            {field.name}
          </AppearanceButton>
        ))}
      </div>
      <div className="text-right">
        <Button
          variant="outline"
          color="primary"
          startIcon={<AddIcon />}
          size="xs"
          onClick={() => {
            const id = nanoid(10);
            append({
              name: trans(
                message('New menu :number', {
                  values: {number: fields.length + 1},
                })
              ),
              id,
              positions: [],
              items: [],
            });
            navigate(`${fields.length}`);
          }}
        >
          <Trans message="Create menu" />
        </Button>
      </div>
    </Fragment>
  );
}
