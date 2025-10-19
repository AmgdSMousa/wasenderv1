import React, { useState, useEffect, useRef } from 'react';
import { Campaign, Contact, Account, CampaignStatus } from '../types';
import { PlusIcon, TrashIcon, RocketIcon, PaperclipIcon } from './icons';
import { generateId, parseSpintax } from '../utils/helpers';
import { generateMessageWithAI } from '../services/geminiService';

interface CampaignsProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  contacts: Contact[];
  accounts: Account[];
}

const Campaigns: React.FC<CampaignsProps> = ({ campaigns, setCampaigns, contacts, accounts }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Partial<Campaign>>({});
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const sendingIntervals = useRef<Record<string, number>>({});

  const handleSaveCampaign = () => {
    if (currentCampaign.name && currentCampaign.accountId && selectedContacts.length > 0 && currentCampaign.message?.text) {
      const newCampaign: Campaign = {
        id: generateId(),
        name: currentCampaign.name,
        accountId: currentCampaign.accountId,
        contacts: selectedContacts,
        message: { text: currentCampaign.message.text, media: currentCampaign.message.media },
        status: currentCampaign.schedule ? CampaignStatus.Scheduled : CampaignStatus.Draft,
        schedule: currentCampaign.schedule,
        delay: { min: currentCampaign.delay?.min || 2, max: currentCampaign.delay?.max || 5 },
        progress: { total: selectedContacts.length, sent: 0, failed: 0 },
      };
      setCampaigns(prev => [...prev, newCampaign]);
      setShowModal(false);
      setCurrentCampaign({});
      setSelectedContacts([]);
    }
  };

  const startSending = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: CampaignStatus.Sending } : c));
    
    let sentCount = 0;
    const campaign = campaigns.find(c => c.id === campaignId);
    if(!campaign) return;

    // FIX: Use window.setInterval to ensure the return type is 'number' in browser environments, avoiding conflict with NodeJS.Timeout type.
    const interval = window.setInterval(() => {
        if (sentCount >= campaign.contacts.length) {
            // FIX: Use window.clearInterval to match window.setInterval.
            window.clearInterval(interval);
            setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, status: CampaignStatus.Completed } : c));
            return;
        }

        sentCount++;
        const isSuccess = Math.random() > 0.1; // 90% success rate
        
        setCampaigns(prev => prev.map(c => c.id === campaignId ? {
            ...c,
            progress: { 
                ...c.progress,
                sent: c.progress.sent + (isSuccess ? 1 : 0),
                failed: c.progress.failed + (isSuccess ? 0 : 1),
            }
        } : c));
    }, (campaign.delay.min + Math.random() * (campaign.delay.max - campaign.delay.min)) * 1000);
    
    sendingIntervals.current[campaignId] = interval;
  };

  const handleGenerateAIMessage = async () => {
    const prompt = window.prompt("Enter a prompt for the AI to generate a message (e.g., 'A discount on our new coffee blend')");
    if (prompt) {
      setIsGeneratingAI(true);
      const generatedText = await generateMessageWithAI(prompt);
      setCurrentCampaign(prev => ({...prev, message: {...prev.message, text: generatedText}}));
      setIsGeneratingAI(false);
    }
  };

  const deleteCampaign = (id: string) => {
    if(sendingIntervals.current[id]) {
      // FIX: Use window.clearInterval to match window.setInterval.
      window.clearInterval(sendingIntervals.current[id]);
      delete sendingIntervals.current[id];
    }
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  useEffect(() => {
    const now = new Date();
    campaigns.forEach(c => {
        if(c.status === CampaignStatus.Scheduled && c.schedule && new Date(c.schedule) <= now) {
            startSending(c.id);
        }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns, new Date().getMinutes()]); // Check every minute

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Campaigns</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-whatsapp-teal text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-80 transition-colors"
        >
          <PlusIcon /> <span className="ml-2">New Campaign</span>
        </button>
      </div>

      <div className="space-y-6">
        {campaigns.map(c => (
          <div key={c.id} className="bg-whatsapp-light p-5 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-100">{c.name}</h3>
                    <p className="text-sm text-whatsapp-gray">Account: {accounts.find(a=>a.id === c.accountId)?.name}</p>
                    <p className="text-sm text-whatsapp-gray mt-2 max-w-lg truncate">Message: "{c.message.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 text-sm rounded-full ${
                        c.status === 'Completed' ? 'bg-green-500 text-white' : 
                        c.status === 'Sending' ? 'bg-blue-500 text-white' :
                        c.status === 'Scheduled' ? 'bg-yellow-500 text-black' :
                        'bg-gray-600 text-gray-200'
                     }`}>
                        {c.status}
                     </span>
                     {c.status === CampaignStatus.Draft && (
                        <button onClick={() => startSending(c.id)} className="bg-whatsapp-green-light text-white font-bold py-1 px-3 rounded-lg flex items-center text-sm">
                            <RocketIcon /> Start
                        </button>
                     )}
                     <button onClick={() => deleteCampaign(c.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-300">Progress: {c.progress.sent} Sent, {c.progress.failed} Failed of {c.progress.total}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div 
                        className="bg-whatsapp-teal h-2.5 rounded-full" 
                        style={{width: `${c.progress.total > 0 ? ((c.progress.sent + c.progress.failed) / c.progress.total) * 100 : 0}%`}}
                    ></div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-whatsapp-light p-8 rounded-lg w-full max-w-4xl max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Create New Campaign</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                    <label className="block text-whatsapp-gray mb-2">Campaign Name</label>
                    <input type="text" onChange={e => setCurrentCampaign({...currentCampaign, name: e.target.value})} className="w-full p-2 bg-whatsapp-dark text-gray-200 rounded border border-gray-600" />

                    <label className="block text-whatsapp-gray mb-2 mt-4">Sending Account</label>
                    <select onChange={e => setCurrentCampaign({...currentCampaign, accountId: e.target.value})} className="w-full p-2 bg-whatsapp-dark text-gray-200 rounded border border-gray-600">
                        <option>Select an account</option>
                        {accounts.filter(a=>a.verified).map(a => <option key={a.id} value={a.id}>{a.name} ({a.phone})</option>)}
                    </select>

                    <label className="block text-whatsapp-gray mb-2 mt-4">Message</label>
                    <textarea value={currentCampaign.message?.text || ''} onChange={e => setCurrentCampaign({...currentCampaign, message: { ...currentCampaign.message, text: e.target.value}})} rows={5} className="w-full p-2 bg-whatsapp-dark text-gray-200 rounded border border-gray-600"></textarea>
                    <p className="text-xs text-whatsapp-gray mt-1">Use spintax like `{`Hi|Hello`}` for variations.</p>
                    <div className="flex items-center gap-4 mt-2">
                        <button onClick={handleGenerateAIMessage} className="text-sm bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-lg" disabled={isGeneratingAI}>
                            {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                        </button>
                        <label htmlFor="media-upload" className="cursor-pointer text-sm bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded-lg flex items-center">
                            <PaperclipIcon/> <span className="ml-2">Attach Media</span>
                        </label>
                        <input id="media-upload" type="file" className="hidden" onChange={e => e.target.files && setCurrentCampaign({...currentCampaign, message: {...currentCampaign.message, media: e.target.files[0]}})} />
                    </div>
                    {currentCampaign.message?.media && <p className="text-sm text-green-400 mt-2">File attached: {currentCampaign.message.media.name}</p>}

                    <label className="block text-whatsapp-gray mb-2 mt-4">Send Delay (seconds)</label>
                    <div className="flex gap-4">
                        <input type="number" placeholder="Min" defaultValue={2} onChange={e => setCurrentCampaign({...currentCampaign, delay: {...currentCampaign.delay, min: parseInt(e.target.value)}})} className="w-full p-2 bg-whatsapp-dark text-gray-200 rounded border border-gray-600" />
                        <input type="number" placeholder="Max" defaultValue={5} onChange={e => setCurrentCampaign({...currentCampaign, delay: {...currentCampaign.delay, max: parseInt(e.target.value)}})} className="w-full p-2 bg-whatsapp-dark text-gray-200 rounded border border-gray-600" />
                    </div>
                    
                    <label className="block text-whatsapp-gray mb-2 mt-4">Schedule (Optional)</label>
                    <input type="datetime-local" onChange={e => setCurrentCampaign({...currentCampaign, schedule: new Date(e.target.value)})} className="w-full p-2 bg-whatsapp-dark text-gray-200 rounded border border-gray-600" />
                </div>
                {/* Right Column */}
                <div>
                    <label className="block text-whatsapp-gray mb-2">Select Contacts ({selectedContacts.length})</label>
                    <div className="border border-gray-600 rounded bg-whatsapp-dark h-96 overflow-y-auto p-2">
                        {contacts.map(contact => (
                            <div key={contact.id} className="flex items-center p-2 rounded hover:bg-gray-700">
                                <input type="checkbox" className="form-checkbox h-5 w-5 bg-whatsapp-dark border-gray-600 text-whatsapp-teal focus:ring-whatsapp-teal"
                                    checked={selectedContacts.some(c => c.id === contact.id)}
                                    onChange={e => {
                                        if (e.target.checked) setSelectedContacts([...selectedContacts, contact]);
                                        else setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
                                    }}
                                />
                                <div className="ml-3 text-gray-200">
                                    <p>{contact.name}</p>
                                    <p className="text-sm text-whatsapp-gray">+{contact.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8">
              <button onClick={() => setShowModal(false)} className="text-gray-300 mr-4">Cancel</button>
              <button onClick={handleSaveCampaign} className="bg-whatsapp-teal text-white font-bold py-2 px-4 rounded">Save Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
