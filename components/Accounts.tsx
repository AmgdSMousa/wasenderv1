import React, { useState } from 'react';
import { Account } from '../types';
import { PlusIcon, TrashIcon, InfoIcon } from './icons';
import { generateId, formatPhoneNumber } from '../utils/helpers';

interface AccountsProps {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountPhone, setNewAccountPhone] = useState('');
  const [verifyingAccount, setVerifyingAccount] = useState<Account | null>(null);

  const addAccount = () => {
    if (newAccountName && newAccountPhone) {
      const newAccount: Account = {
        id: generateId(),
        name: newAccountName,
        phone: formatPhoneNumber(newAccountPhone),
        verified: false,
      };
      setAccounts([...accounts, newAccount]);
      setShowAddModal(false);
      setNewAccountName('');
      setNewAccountPhone('');
    }
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };
  
  const startVerification = (account: Account) => {
    setVerifyingAccount(account);
    setTimeout(() => {
        setAccounts(prev => prev.map(acc => acc.id === account.id ? {...acc, verified: true} : acc));
        setVerifyingAccount(null);
    }, 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Accounts</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-whatsapp-teal text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-80 transition-colors"
        >
          <PlusIcon /> <span className="ml-2">Add Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-whatsapp-light p-5 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-100">{account.name}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full ${account.verified ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                      {account.verified ? 'Verified' : 'Unverified'}
                  </span>
              </div>
              <p className="text-whatsapp-gray mt-1">+{account.phone}</p>
            </div>
            <div className="flex items-center justify-between mt-4">
              {!account.verified && (
                <button 
                  onClick={() => startVerification(account)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                    Verify Account
                </button>
              )}
               <div className="flex-grow"></div>
              <button onClick={() => deleteAccount(account.id)} className="text-red-500 hover:text-red-400">
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-whatsapp-light p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Add New Account</h2>
            <input
              type="text"
              placeholder="Account Name (e.g., Marketing Team)"
              value={newAccountName}
              onChange={e => setNewAccountName(e.target.value)}
              className="w-full p-2 mb-4 bg-whatsapp-dark text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-whatsapp-teal"
            />
            <input
              type="text"
              placeholder="Phone Number (e.g., +1 555 123 4567)"
              value={newAccountPhone}
              onChange={e => setNewAccountPhone(e.target.value)}
              className="w-full p-2 mb-6 bg-whatsapp-dark text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-whatsapp-teal"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowAddModal(false)} className="text-gray-300 mr-4">Cancel</button>
              <button onClick={addAccount} className="bg-whatsapp-teal text-white font-bold py-2 px-4 rounded">Add</button>
            </div>
          </div>
        </div>
      )}

      {verifyingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-whatsapp-light p-8 rounded-lg w-full max-w-md text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Verifying {verifyingAccount.name}</h2>
                <div className="p-6 bg-whatsapp-dark border border-dashed border-gray-600 rounded-lg text-center">
                    <InfoIcon className="w-16 h-16 mx-auto text-whatsapp-gray" />
                    <h3 className="text-lg font-semibold mt-4">Simulation Mode</h3>
                    <p className="text-whatsapp-gray text-sm mt-1">
                        In a real application, you would scan a QR code. This account will be automatically verified for demonstration purposes.
                    </p>
                </div>
                 <p className="mt-4 text-sm animate-pulse">Simulating verification...</p>
            </div>
        </div>
      )}

    </div>
  );
};

export default Accounts;