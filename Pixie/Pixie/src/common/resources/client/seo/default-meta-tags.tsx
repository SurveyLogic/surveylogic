import {Helmet} from './helmet';
import {useBootstrapData} from '../core/bootstrap-data/bootstrap-data-context';

export function DefaultMetaTags() {
  const {
    data: {default_meta_tags},
  } = useBootstrapData();
  return <Helmet tags={default_meta_tags} />;
}
