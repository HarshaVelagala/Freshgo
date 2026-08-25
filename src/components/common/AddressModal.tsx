import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Check, Plus } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useToast } from './Toast';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const user = useUserStore((state) => state.user);
  const selectedAddressId = useUserStore((state) => state.selectedAddressId);
  const setSelectedAddress = useUserStore((state) => state.setSelectedAddress);
  const addAddress = useUserStore((state) => state.addAddress);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newZip, setNewZip] = useState('');

  const handleSelect = (id: string) => {
    setSelectedAddress(id);
    addToast({
      type: 'success',
      title: 'Delivery Address Updated',
      message: 'Your active delivery location has been updated.',
    });
    onClose();
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newZip) return;

    addAddress({
      title: newTitle || 'Other Address',
      street: newStreet,
      city: newCity,
      zipCode: newZip,
      isDefault: false,
    });

    addToast({
      type: 'success',
      title: 'Address Added',
      message: 'New delivery address has been saved and selected.',
    });

    setIsAddingNew(false);
    setNewTitle('');
    setNewStreet('');
    setNewCity('');
    setNewZip('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="address-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[#141414] rounded-3xl p-5 sm:p-6 shadow-2xl z-10 border border-white/10 text-[#E0E0E0]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#A7C957]/15 text-[#A7C957] flex items-center justify-center border border-[#A7C957]/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Choose Delivery Address</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isAddingNew ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <button
                      key={addr.id}
                      id={`select-addr-${addr.id}`}
                      onClick={() => handleSelect(addr.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                        isSelected
                          ? 'border-[#A7C957] bg-[#A7C957]/10 shadow-xs'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-xs text-[#E0E0E0]">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-white/10 text-neutral-300 px-1.5 py-0.2 rounded font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-300 truncate">{addr.street}</p>
                        <p className="text-[11px] text-neutral-400">
                          {addr.city}, {addr.zipCode}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#A7C957] text-[#0A0A0A] flex items-center justify-center shrink-0 mt-0.5 font-black">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}

                <button
                  id="add-new-address-toggle"
                  onClick={() => setIsAddingNew(true)}
                  className="w-full py-3 px-4 border border-dashed border-white/20 hover:border-[#A7C957] hover:bg-[#A7C957]/10 text-neutral-300 hover:text-[#A7C957] rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Delivery Address</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNew} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Address Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vacation Home, Gym, Parents"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#A7C957] focus:border-[#A7C957] focus:outline-hidden text-white placeholder-neutral-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123 Market St, Suite 400"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#A7C957] focus:border-[#A7C957] focus:outline-hidden text-white placeholder-neutral-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="San Francisco, CA"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#A7C957] focus:border-[#A7C957] focus:outline-hidden text-white placeholder-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">ZIP *</label>
                    <input
                      type="text"
                      required
                      placeholder="94103"
                      value={newZip}
                      onChange={(e) => setNewZip(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-[#A7C957] focus:border-[#A7C957] focus:outline-hidden text-white placeholder-neutral-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-neutral-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#A7C957] hover:bg-[#B7D968] text-[#0A0A0A] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
