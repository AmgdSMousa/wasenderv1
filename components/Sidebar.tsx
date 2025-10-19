import React from 'react';
import { DashboardIcon, AccountsIcon, ContactsIcon, CampaignsIcon, AnalyticsIcon } from './icons';

type View = 'dashboard' | 'accounts' | 'contacts' | 'campaigns' | 'analytics';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive
        ? 'bg-whatsapp-teal text-white'
        : 'text-whatsapp-gray hover:bg-whatsapp-light hover:text-gray-100'
    }`}
  >
    {icon}
    <span className="ml-4 text-lg font-medium">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-64 bg-whatsapp-light h-screen p-4 flex flex-col fixed">
      <div className="flex items-center mb-8">
        <div className="bg-whatsapp-green-light p-2 rounded-full">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2m4 0h-2m-2-2v2m-2 2h-2"></path></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-100 ml-3">WA Sender</h1>
      </div>
      <nav>
        <ul>
          <NavItem
            icon={<DashboardIcon />}
            label="Dashboard"
            isActive={currentView === 'dashboard'}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem
            icon={<AccountsIcon />}
            label="Accounts"
            isActive={currentView === 'accounts'}
            onClick={() => setCurrentView('accounts')}
          />
          <NavItem
            icon={<ContactsIcon />}
            label="Contacts"
            isActive={currentView === 'contacts'}
            onClick={() => setCurrentView('contacts')}
          />
          <NavItem
            icon={<CampaignsIcon />}
            label="Campaigns"
            isActive={currentView === 'campaigns'}
            onClick={() => setCurrentView('campaigns')}
          />
          <NavItem
            icon={<AnalyticsIcon />}
            label="Analytics"
            isActive={currentView === 'analytics'}
            onClick={() => setCurrentView('analytics')}
          />
        </ul>
      </nav>
      <div className="mt-auto text-center text-whatsapp-gray text-sm">
        <p>WhatsApp Pro Sender v1.0</p>
        <p className="mt-2 text-xs">This is a UI simulation. No messages are actually sent.</p>
      </div>
    </div>
  );
};

export default Sidebar;