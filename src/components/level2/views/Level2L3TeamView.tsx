import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { L2DashboardData, User } from '../../../types.ts';

interface Level2L3TeamViewProps {
  data: L2DashboardData;
  onCreateL3Person: (data: {
    name: string;
    email?: string;
    phone: string;
    designation: string;
    assignedArea?: string;
  }) => Promise<void>;
  onOpenDisburseModal: () => void;
}

export const Level2L3TeamView: React.FC<Level2L3TeamViewProps> = ({
  data,
  onCreateL3Person,
  onOpenDisburseModal,
}) => {
  const { currentL2User, supervisedL3Overseers } = data;

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('Zonal Field Overseer & Pastor');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [assignedArea, setAssignedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !designation.trim() || !phone.trim()) {
      setErrorMsg('Full name, designation, and phone number are required.');
      return;
    }

    try {
      setLoading(true);
      await onCreateL3Person({
        name: name.trim(),
        designation: designation.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        assignedArea: assignedArea.trim() || 'Regional District Field',
      });

      setSuccessMsg(`Successfully created new Level 3 Overseer: ${name}. Reporting relationship established.`);
      setName('');
      setPhone('+91 ');
      setEmail('');
      setAssignedArea('');
      setModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create Level 3 person.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="level2-l3-team-view" className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              HIERARCHY MANAGEMENT
            </span>
            <span className="text-xs text-slate-400">Level 3 Field Directorate</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">
            Level 3 Field Overseers Team
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Level 3 Overseers reporting to the Central Directorate. Maintain individual source isolation for every overseer.
          </p>
        </div>

        <button
          id="create-l3-person-btn"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>[ CREATE LEVEL 3 PERSON ]</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Overseers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supervisedL3Overseers.map((overseer) => (
          <div
            key={overseer.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-800/40 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-200 text-lg">
                    {overseer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{overseer.name}</h3>
                    <p className="text-xs text-slate-400">{overseer.designation}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-emerald-400 rounded-full border border-slate-700">
                      LEVEL 3 OVERSEER
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact & Jurisdiction Details */}
              <div className="mt-4 space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div className="flex items-center space-x-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{overseer.assignedArea || 'District Jurisdiction'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{overseer.phone || 'No phone recorded'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{overseer.email || 'church.overseer@diocesan.org'}</span>
                </div>
              </div>

              {/* Multi-Source Financial Breakdown */}
              <div className="mt-4 bg-slate-800/60 rounded-lg p-3 border border-slate-700/80 space-y-2 text-xs">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Isolated Source Allocations
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Funds In Hand:</span>
                    <span className="font-bold text-emerald-400">
                      ₹{overseer.currentOverseerBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Allocated by You ({currentL2User.name.split(' ')[0]}):</span>
                    <span className="font-bold text-sky-400">
                      ₹{overseer.sourceAllocationsFromThisL2.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {overseer.allSourcesBreakdown.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/80 text-[11px] space-y-1">
                    <span className="text-slate-400 font-medium">Sources breakdown:</span>
                    {overseer.allSourcesBreakdown.map((src, i) => (
                      <div key={i} className="flex justify-between text-slate-300">
                        <span className="truncate max-w-[150px]">{src.sourceL2Name}</span>
                        <span className="font-semibold">₹{src.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Disburse CTA */}
            <div className="pt-2">
              <button
                onClick={onOpenDisburseModal}
                className="w-full py-2 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 border border-slate-700"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Disburse Funds</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Level 3 Person */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Create Level 3 Person</h3>
                  <p className="text-xs text-slate-400">Register new field overseer reporting to {currentL2User.name}</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  id="create-l3-name-input"
                  type="text"
                  placeholder="e.g. Pastor Samuel Sundaram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Designation / Role Title *
                </label>
                <input
                  id="create-l3-designation-input"
                  type="text"
                  placeholder="e.g. South Diocesan Zonal Overseer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="create-l3-phone-input"
                    type="text"
                    placeholder="+91 98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="create-l3-email-input"
                    type="email"
                    placeholder="pastor.samuel@gracechurch.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Assigned Parish Jurisdiction / Scope
                </label>
                <input
                  id="create-l3-area-input"
                  type="text"
                  placeholder="e.g. South Diocesan Parishes & Mission Hubs"
                  value={assignedArea}
                  onChange={(e) => setAssignedArea(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  id="confirm-create-l3-btn"
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-lg transition-all"
                >
                  {loading ? 'Creating...' : 'Create & Onboard Overseer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
