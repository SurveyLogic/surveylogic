import {
  BackendFilter,
  FilterControlType,
} from '../../datatable/filters/backend-filter';
import {
  CreatedAtFilter,
  UpdatedAtFilter,
} from '../../datatable/filters/timestamp-filters';
import {message} from '../../i18n/message';
import {USER_MODEL} from '../../auth/user';

export const FILE_ENTRY_TYPE_FILTER = new BackendFilter({
  type: FilterControlType.Select,
  key: 'type',
  label: message('Type'),
  description: message('Type of the file'),
  defaultValue: '05',
  options: [
    {key: '02', label: message('Text'), value: 'text'},
    {
      key: '03',
      label: message('Audio'),
      value: 'audio',
    },
    {
      key: '04',
      label: message('Video'),
      value: 'video',
    },
    {
      key: '05',
      label: message('Image'),
      value: 'image',
    },
    {key: '06', label: message('PDF'), value: 'pdf'},
    {
      key: '07',
      label: message('Spreadsheet'),
      value: 'spreadsheet',
    },
    {
      key: '08',
      label: message('Word Document'),
      value: 'word',
    },
    {
      key: '09',
      label: message('Photoshop'),
      value: 'photoshop',
    },
    {
      key: '10',
      label: message('Archive'),
      value: 'archive',
    },
    {
      key: '11',
      label: message('Folder'),
      value: 'folder',
    },
  ],
});

export const FILE_ENTRY_INDEX_FILTERS: BackendFilter[] = [
  FILE_ENTRY_TYPE_FILTER,
  new BackendFilter({
    type: FilterControlType.Select,
    key: 'public',
    label: message('Visibility'),
    defaultValue: '01',
    description: message('Whether file is publicly accessible'),
    options: [
      {key: '01', label: message('Private'), value: false},
      {key: '02', label: message('Public'), value: true},
    ],
  }),
  new CreatedAtFilter({
    description: message('Date file was uploaded'),
  }),
  new UpdatedAtFilter({
    description: message('Date file was last changed'),
  }),
  new BackendFilter({
    type: FilterControlType.SelectModel,
    model: USER_MODEL,
    key: 'owner_id',
    label: message('Uploader'),
    description: message('User that this file was uploaded by'),
  }),
];
