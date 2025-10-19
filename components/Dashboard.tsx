
import React from 'react';
import { Account, Contact, Campaign } from '../types';
import { AccountsIcon, ContactsIcon, CampaignsIcon } from './icons';

interface DashboardProps {
  accounts: Account[];
  contacts: Contact[];
  campaigns: Campaign[];
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-whatsapp-light p-6 rounded-lg shadow-lg flex items-center">
        <div className="p-3 rounded-full bg-whatsapp-dark mr-4">
           {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-whatsapp-gray">{title}</h3>
            <p className="text-3xl font-bold text-gray-100">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ accounts, contacts, campaigns }) => {
    const completedCampaigns = campaigns.filter(c => c.status === 'Completed').length;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Accounts" value={accounts.length} icon={<AccountsIcon />} />
        <StatCard title="Total Contacts" value={contacts.length} icon={<ContactsIcon />} />
        <StatCard title="Campaigns Completed" value={completedCampaigns} icon={<CampaignsIcon />} />
      </div>

      <div className="mt-10 bg-whatsapp-light p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Recent Campaigns</h2>
        {campaigns.length > 0 ? (
            <div className="overflow-x-auto">
                 <table className="w-full text-left text-whatsapp-gray">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="p-4">Campaign Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.slice(0, 5).map(campaign => (
                            <tr key={campaign.id} className="border-b border-gray-800 hover:bg-whatsapp-dark">
                                <td className="p-4 text-gray-200">{campaign.name}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 text-sm rounded-full ${
                                         campaign.status === 'Completed' ? 'bg-green-500 text-white' : 
                                         campaign.status === 'Sending' ? 'bg-blue-500 text-white' :
                                         campaign.status === 'Scheduled' ? 'bg-yellow-500 text-black' :
                                         'bg-gray-600 text-gray-200'
                                     }`}>
                                         {campaign.status}
                                     </span>
                                </td>
                                <td className="p-4">
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div 
                                            className="bg-whatsapp-teal h-2.5 rounded-full" 
                                            style={{width: `${campaign.progress.total > 0 ? (campaign.progress.sent / campaign.progress.total) * 100 : 0}%`}}
                                        ></div>
                                    </div>
                                    <span className="text-sm">{campaign.progress.sent} / {campaign.progress.total}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-center text-whatsapp-gray py-8">No campaigns created yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
