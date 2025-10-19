import React, { useState, useMemo } from 'react';
import { Contact } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import { generateId, formatPhoneNumber } from '../utils/helpers';

interface ContactsProps {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

type FilterType = 'contains' | 'namePrefix' | 'phonePrefix';

const Contacts: React.FC<ContactsProps> = ({ contacts, setContacts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('contains');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  const handleAddContact = () => {
    if (newContactName && newContactPhone) {
      const newContact: Contact = {
        id: generateId(),
        name: newContactName,
        phone: formatPhoneNumber(newContactPhone),
      };
      setContacts(prev => [...prev, newContact]);
      setShowAddModal(false);
      setNewContactName('');
      setNewContactPhone('');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        const newContacts: Contact[] = lines.map(line => {
          const [name, phone] = line.split(',').map(item => item.trim());
          return { id: generateId(), name, phone: formatPhoneNumber(phone) };
        }).filter(c => c.name && c.phone);
        setContacts(prev => [...prev, ...newContacts]);
      };
      reader.readAsText(file);
    }
  };
  
  const deleteSelectedContacts = () => {
    setContacts(contacts.filter(contact => !selectedContacts.has(contact.id)));
    setSelectedContacts(new Set());
  };
  
  const toggleSelectContact = (id: string) => {
      const newSelection = new Set(selectedContacts);
      if (newSelection.has(id)) {
          newSelection.delete(id);
      } else {
          newSelection.add(id);
      }
      setSelectedContacts(newSelection);
  }
  
  const toggleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length && filteredContacts.length > 0) {
        setSelectedContacts(new Set());
    } else {
        setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  }

  const filteredContacts = useMemo(() => {
    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch) {
      return contacts;
    }

    const lowercasedSearchTerm = trimmedSearch.toLowerCase();

    switch (filterType) {
      case 'namePrefix':
        return contacts.filter(contact =>
          contact.name.toLowerCase().startsWith(lowercasedSearchTerm)
        );
      case 'phonePrefix':
        return contacts.filter(contact =>
          contact.phone.startsWith(trimmedSearch)
        );
      case 'contains':
      default:
        return contacts.filter(contact =>
          contact.name.toLowerCase().includes(lowercasedSearchTerm) ||
          contact.phone.includes(trimmedSearch)
        );
    }
  }, [contacts, searchTerm, filterType]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-gray-100">Contacts</h1>
        <div className="flex items-center gap-4">
            <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-80 transition-colors">Import from File</label>
            <input id="file-upload" type="file" className="hidden" accept=".csv,.txt" onChange={handleFileImport} />
            <button
                onClick={() => setShowAddModal(true)}
                className="bg-whatsapp-teal text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-opacity-80 transition-colors"
            >
                <PlusIcon /> <span className="ml-2">Add Contact</span>
            </button>
        </div>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2 w-full md:w-1/2 lg:w-1/3">
             <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="p-2 bg-whatsapp-dark text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-whatsapp-teal"
            >
                <option value="contains">Contains</option>
                <option value="namePrefix">Name starts with</option>
                <option value="phonePrefix">Phone starts with</option>
            </select>
            <input 
                type="text"
                placeholder="Filter value..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-whatsapp-dark text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-whatsapp-teal"
            />
        </div>
        {selectedContacts.size > 0 && (
            <button onClick={deleteSelectedContacts} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center hover:bg-red-700 transition-colors">
                <TrashIcon/> <span className="ml-2">Delete ({selectedContacts.size})</span>
            </button>
        )}
      </div>

      <div className="bg-whatsapp-light rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-y-auto" style={{maxHeight: '70vh'}}>
          <table className="w-full text-left text-whatsapp-gray">
              <thead className="border-b border-gray-700 bg-whatsapp-dark sticky top-0">
                  <tr>
                      <th className="p-4 w-12"><input type="checkbox" className="form-checkbox h-5 w-5 bg-whatsapp-dark border-gray-600 text-whatsapp-teal focus:ring-whatsapp-teal" onChange={toggleSelectAll} checked={filteredContacts.length > 0 && selectedContacts.size === filteredContacts.length}/></th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Phone Number</th>
                  </tr>
              </thead>
              <tbody>
                  {filteredContacts.map(contact => (
                      <tr key={contact.id} className="border-b border-gray-800 hover:bg-whatsapp-dark">
                          <td className="p-4 w-12"><input type="checkbox" className="form-checkbox h-5 w-5 bg-whatsapp-dark border-gray-600 text-whatsapp-teal focus:ring-whatsapp-teal" checked={selectedContacts.has(contact.id)} onChange={() => toggleSelectContact(contact.id)} /></td>
                          <td className="p-4 text-gray-200">{contact.name}</td>
                          <td className="p-4">+{contact.phone}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {filteredContacts.length === 0 && <p className="text-center p-8">No contacts found.</p>}
        </div>
      </div>
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-whatsapp-light p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Add New Contact</h2>
            <input
              type="text"
              placeholder="Contact Name"
              value={newContactName}
              onChange={e => setNewContactName(e.target.value)}
              className="w-full p-2 mb-4 bg-whatsapp-dark text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-whatsapp-teal"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newContactPhone}
              onChange={e => setNewContactPhone(e.target.value)}
              className="w-full p-2 mb-6 bg-whatsapp-dark text-gray-200 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-whatsapp-teal"
            />
            <div className="flex justify-end">
              <button onClick={() => setShowAddModal(false)} className="text-gray-300 mr-4">Cancel</button>
              <button onClick={handleAddContact} className="bg-whatsapp-teal text-white font-bold py-2 px-4 rounded">Add</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Contacts;