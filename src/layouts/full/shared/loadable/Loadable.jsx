import { Suspense } from 'react';
import Spinner from '../../../../views/spinner/Spinner';

const Loadable = (
Component) =>
{
  return function LoadableComponent(props) {
    return (
      <Suspense fallback={<Spinner />}>
        <Component {...props} />
      </Suspense>);

  };
};

export default Loadable;