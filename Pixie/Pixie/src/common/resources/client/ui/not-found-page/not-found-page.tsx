import {Trans} from '../../i18n/trans';
import {Button} from '../buttons/button';
import {Link} from 'react-router-dom';
import imgUrl1 from './404-1.png';
import imgUrl2 from './404-2.png';

export function NotFoundPage() {
  return (
    <div className="lg:px-96 lg:py-96 md:py-80 md:px-176 px-16 py-96 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-112 gap-64">
      <div className="xl:pt-96 w-full xl:w-1/2 relative pb-48 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div className="relative z-10">
              <h1 className="my-8 text-main font-bold text-2xl">
                <Trans message="Looks like you've found the doorway to the great nothing" />
              </h1>
              <p className="my-16 text-main">
                <Trans
                  message="Sorry about that! Please visit our homepage to get where you need
                to go."
                />
              </p>
              <Button
                className="my-8"
                elementType={Link}
                size="lg"
                to="/"
                variant="flat"
                color="primary"
              >
                <Trans message="Take me there!" />
              </Button>
            </div>
          </div>
          <div className="dark:opacity-5">
            <img src={imgUrl2} alt="" />
          </div>
        </div>
      </div>
      <div className="dark:opacity-80">
        <img src={imgUrl1} alt="" />
      </div>
    </div>
  );
}
