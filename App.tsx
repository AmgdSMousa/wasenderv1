import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Contacts from './components/Contacts';
import Campaigns from './components/Campaigns';
import Analytics from './components/Analytics';
import { Account, Contact, Campaign } from './types';

type View = 'dashboard' | 'accounts' | 'contacts' | 'campaigns' | 'analytics';

const loadFromLocalStorage = <T,>(key: string, reviver?: (key: string, value: any) => any): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved, reviver);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error(`Failed to load or parse ${key} from localStorage`, error);
  }
  return [];
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const [accounts, setAccounts] = useState<Account[]>(() => loadFromLocalStorage<Account>('wa-accounts'));
  const [contacts, setContacts] = useState<Contact[]>(() => loadFromLocalStorage<Contact>('wa-contacts'));
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    return loadFromLocalStorage<Campaign>('wa-campaigns').map(c => ({
      ...c,
      schedule: c.schedule ? new Date(c.schedule) : undefined,
    }));
  });


  useEffect(() => {
    localStorage.setItem('wa-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('wa-contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('wa-campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard accounts={accounts} contacts={contacts} campaigns={campaigns} />;
      case 'accounts':
        return <Accounts accounts={accounts} setAccounts={setAccounts} />;
      case 'contacts':
        return <Contacts contacts={contacts} setContacts={setContacts} />;
      case 'campaigns':
        return <Campaigns campaigns={campaigns} setCampaigns={setCampaigns} contacts={contacts} accounts={accounts} />;
      case 'analytics':
        return <Analytics campaigns={campaigns} />;
      default:
        return <Dashboard accounts={accounts} contacts={contacts} campaigns={campaigns} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-whatsapp-chat">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 ml-64 p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;