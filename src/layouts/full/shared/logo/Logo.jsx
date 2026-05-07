
import { Link } from 'react-router';
import LogoIcon from 'src/superAdmin/assets/images/logos/dark-logo.svg';

const Logo = () => {
  return (
    <Link to={'/'}>
            <img src={LogoIcon} alt="logo" />
        </Link>);

};

export default Logo;