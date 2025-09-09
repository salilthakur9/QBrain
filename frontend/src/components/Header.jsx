import React, { Fragment } from 'react'; // Import Fragment
import { assets } from "../assets/assets";
import { Menu, Transition } from '@headlessui/react'; // Import Menu and Transition

const Header = ({ toggleSidebar, user, openAuthModal, handleLogout }) => {

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to permanently delete your account? This will also erase all your saved history. This action cannot be undone.'
    );

    if (isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/me', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          alert('Your account has been successfully deleted.');
          handleLogout();
        } else {
          const errorText = await response.text();
          alert(`Error: ${errorText || 'Failed to delete account.'}`);
        }
      } catch (error) {
        console.error('Deletion error:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <header className="bg-black p-4 flex justify-between items-center shadow-md z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-700">
           {/* SVG for menu icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img className="w-30 h-10" src={assets.logo} />
      </div>

      <div className="flex items-center gap-4 mr-7">
        {user ? (
          // --- NEW DROPDOWN MENU FOR LOGGED-IN USER ---
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex items-center justify-center w-full rounded-full p-1 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
                {/* On small screens 'sm:', hide the name. It will appear on screens larger than 'sm'. */}
                <span className="font-semibold hidden sm:block ml-2">Hello, {user.name}</span>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-600 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-700 text-white' : 'text-gray-300'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                   <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleDeleteAccount}
                        className={`${
                          active ? 'bg-red-700 text-white' : 'text-red-500'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Delete Account
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          // This part for non-logged-in users remains the same
          <button onClick={openAuthModal} className="bg-sky-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-sky-600">
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;