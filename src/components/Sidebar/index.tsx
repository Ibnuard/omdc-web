import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.jpg';
import IconBarang from '../../images/sidebar/IconBarang';
import IconSidebar from '../../images/sidebar/IconSidebar';
import IconArrow from '../../images/sidebar/IconArrow';
import { useAuth } from '../../hooks/useAuth';
import { cekAkses } from '../../common/utils';
import {
  BanknotesIcon,
  RectangleGroupIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

// Icon

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const { user } = useAuth();
  const IS_ADMIN = user?.isAdmin;
  const IS_SUPER_ADMIN = user?.type == 'SUPERADMIN';

  // check akses
  const hasRequestBarangAkses = cekAkses('#2');
  const hasPengumumanAkses = cekAkses('#3');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-[100dvh] w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink className={' flex items-center gap-x-4'} to="/">
          <img className=" h-10 w-10" src={Logo} alt="Logo" />
          <span className=" text-title-sm font-bold">OMDC V.0.7.9</span>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <IconSidebar />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      {IS_SUPER_ADMIN ? (
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                Menu
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <NavLink
                    to="/"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      !pathname.includes('/departemen') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Super Admin
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/departemen"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/departemen') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Departemen
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      ) : (
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                Menu
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Menu Item Dashboard --> */}
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('reimbursement')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/' ||
                              pathname.includes('reimbursement')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <BanknotesIcon className=" h-5 w-5" />
                          Reimbursement
                          <IconArrow open={open} />
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && 'hidden'
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Riwayat Pengajuan
                              </NavLink>
                            </li>
                            {/* ------ BUAT PENGAJUAN --------- */}
                            {IS_ADMIN ? (
                              <li>
                                <NavLink
                                  to="/reimbursement/diajukan"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Diajukan ke Saya
                                </NavLink>
                              </li>
                            ) : null}
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/* <!-- Menu Item Dashboard --> */}

                {/* <!-- Menu Item Calendar --> */}
                {hasRequestBarangAkses ? (
                  <li>
                    <NavLink
                      to="/request-barang"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('calendar') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <RectangleGroupIcon className=" h-5 w-5" />
                      Permintaan Barang
                    </NavLink>
                  </li>
                ) : null}
                {/* <!-- Menu Item Calendar --> */}
                {hasPengumumanAkses ? (
                  <li>
                    <NavLink
                      to="/pengumuman"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('calendar') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <BellAlertIcon className=" w-5 h-5" />
                      Buat Pengumuman
                    </NavLink>
                  </li>
                ) : null}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
