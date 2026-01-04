
import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPrompt: string;
  onSavePrompt: (newPrompt: string) => void;
  defaultPrompt: string;
  apiKey: string;
  onSaveApiKey: (newKey: string) => void;
  onResetAll: () => void;
}

type Tab = 'persona' | 'security' | 'share';

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentPrompt, 
  onSavePrompt,
  defaultPrompt,
  apiKey,
  onSaveApiKey,
  onResetAll
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('persona');
  const [tempPrompt, setTempPrompt] = useState(currentPrompt);
  const [tempKey, setTempKey] = useState(apiKey);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="flex items-center gap-3">
            <i className="fas fa-sliders text-2xl text-indigo-400"></i>
            <h2 className="text-xl font-bold text-white">App Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-900/50">
          {(['persona', 'security', 'share'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8 h-[400px] overflow-y-auto">
          {activeTab === 'persona' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">AI Instructions</label>
              <textarea
                value={tempPrompt}
                onChange={(e) => setTempPrompt(e.target.value)}
                placeholder="How should the AI behave?"
                className="w-full h-56 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-sm leading-relaxed"
              />
              <button
                onClick={() => setTempPrompt(defaultPrompt)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Reset to Default
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
                <p className="text-sm text-indigo-200 leading-relaxed">
                  Your API key is stored <strong>only in this browser</strong>. It is never transmitted anywhere except directly to Google's Gemini API.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Gemini API Key</label>
                <input
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="Paste your key here..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-400">Danger Zone</h4>
                  <p className="text-xs text-slate-500">Wipe all local settings and transcripts</p>
                </div>
                <button 
                  onClick={onResetAll}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-xs font-bold transition-all"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-slate-300">
              <h3 className="text-lg font-bold text-white">Share Securely</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                  <p className="text-sm">Click the <strong>Share</strong> icon in the header to sync this code to your GitHub.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                  <p className="text-sm">Host the URL and send it to your friend.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                  <p className="text-sm">They use the <strong>Security</strong> tab to add their own key. No credit leaking!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-800/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-semibold text-slate-300 hover:bg-slate-700 transition-all">Cancel</button>
          <button
            onClick={() => {
              onSavePrompt(tempPrompt);
              onSaveApiKey(tempKey);
              onClose();
            }}
            className="px-8 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
