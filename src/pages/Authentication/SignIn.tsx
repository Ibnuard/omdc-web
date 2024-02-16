import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import HeroAuth from '../../images/hero/AuthHero';
import useFetch from '../../hooks/useFetch';
import { LOGIN } from '../../api/routes';
import { API_STATES } from '../../constants/ApiEnum';
import { useAuth } from '../../hooks/useAuth';

const SignIn: React.FC = () => {
  const [userId, setUserId] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const { setToken } = useAuth();
  const navigate = useNavigate();

  function onUserIdChange(event: any) {
    setUserId(event.target.value);
  }

  function onPasswordChange(event: any) {
    setPassword(event.target.value);
  }

  async function onSubmit(e: any) {
    e.preventDefault();

    const body = {
      iduser: userId,
      password: password,
    };

    const { state, data, error } = await useFetch({
      url: LOGIN,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      setToken(data.userToken);
      navigate('/', { replace: true });
    } else {
      console.log(error);
    }
  }

  return (
    <>
      <div className=" xl:grid xl:place-items-center h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="hidden dark:block" src={Logo} alt="Logo" />
                <img className="dark:hidden" src={LogoDark} alt="Logo" />
              </Link>

              <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                suspendisse.
              </p>

              <span className="mt-15 inline-block">
                <HeroAuth />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 hidden sm:block md:p-24 sm:p-32 xl:p-20.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Masuk ke OMDC
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    User ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Masukan user ID"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={userId}
                      onChange={onUserIdChange}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Masukan Password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={password}
                      onChange={onPasswordChange}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <button
                    onClick={onSubmit}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-2 text-white transition hover:bg-opacity-90"
                  >
                    Masuk
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className=" grid min-h-screen w-full place-items-center sm:hidden">
            <div>
              <div className="grid place-items-center p-4 mb-4">
                <div className=" mb-4">
                  <img className="hidden dark:block" src={Logo} alt="Logo" />
                </div>
                <h2 className="text-xl font-medium text-black dark:text-white">
                  Masuk ke OMDC
                </h2>
              </div>

              <div className="w-96 rounded-md dark: bg-slate-700 p-6 shadow-lg">
                <form>
                  <div className="mb-4">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                      User ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Masukan user ID"
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={userId}
                        onChange={onUserIdChange}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Masukan Password"
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        value={password}
                        onChange={onPasswordChange}
                      />
                    </div>
                  </div>
                </form>
                <div className="mb-2">
                  <button
                    onClick={onSubmit}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-1 text-white transition hover:bg-opacity-90"
                  >
                    Masuk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
