'use client';
import { useState, useEffect, useCallback } from 'react';
import { getEvidenceGraph, addEvidence } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';

export default function EvidenceGraph({ onSkillClick = null }) {
  const { user } = useAuth();
  const [evidenceList, setEvidenceList] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, HIGH, VERIFIED, CLAIM
  const [newSkill, setNewSkill] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [newSource, setNewSource] = useState('GitHub repository');
  const [isAdding, setIsAdding] = useState(false);

  const loadGraph = useCallback(async () => {
    if (user?.email) {
      try {
        const list = await getEvidenceGraph(user.email);
        if (list && list.length > 0) {
          setEvidenceList(list);
        } else {
          // Initialize baseline evidence graph for demonstration
          const baseline = [
            { id: 1, skill: 'React & Next.js', evidence: 'Architected Parichaya on-device UI with App Router', source: 'GitHub repository', confidence: 'High', status: 'Strong' },
            { id: 2, skill: 'IndexedDB & idb', evidence: 'Configured local offline storage with multi-store schema', source: 'Production code', confidence: 'High', status: 'Strong' },
            { id: 3, skill: 'Python', evidence: 'Self-reported proficiency in automation scripts', source: 'User claim', confidence: 'Needs Verification', status: 'Developing' },
            { id: 4, skill: 'Docker Containerization', evidence: 'Completed multi-stage build configuration', source: 'Course certificate', confidence: 'Medium', status: 'Intermediate' },
            { id: 5, skill: 'System Design', evidence: 'No verified projects or live architecture diagrams', source: 'Unverified claim', confidence: 'Needs Verification', status: 'Needs Practice' }
          ];
          setEvidenceList(baseline);
          // Persist baseline
          for (const item of baseline) {
            await addEvidence(user.email, item.skill, item.evidence, item.source, item.confidence);
          }
        }
      } catch (err) {
        console.error('Evidence load error:', err);
      }
    }
  }, [user?.email]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const handleAddEvidence = async (e) => {
    e.preventDefault();
    if (!newSkill.trim() || !newEvidence.trim() || !user?.email) return;

    const confidence = newSource === 'User claim' ? 'Needs Verification' : newSource === 'Course certificate' ? 'Medium' : 'High';
    await addEvidence(user.email, newSkill.trim(), newEvidence.trim(), newSource, confidence);
    setNewSkill('');
    setNewEvidence('');
    setIsAdding(false);
    await loadGraph();
  };

  const filtered = evidenceList.filter(item => {
    if (filter === 'HIGH') return item.confidence === 'High';
    if (filter === 'VERIFIED') return item.source !== 'User claim' && item.source !== 'Unverified claim';
    if (filter === 'CLAIM') return item.source === 'User claim' || item.source === 'Unverified claim';
    return true;
  });

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕸️</span>
            <h3 className="text-lg font-bold text-zinc-100">Skill Evidence Graph</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            <span className="font-semibold text-orange-400">Skill → Evidence → Source → Confidence:</span> Claims without proof require verification before inclusion in ATS resumes.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-colors self-start sm:self-auto"
        >
          {isAdding ? '✕ Cancel' : '+ Attach Evidence'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'ALL', label: `All Nodes (${evidenceList.length})` },
          { id: 'VERIFIED', label: 'Verified Evidence (High/Med)' },
          { id: 'CLAIM', label: 'Unverified Claims' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              filter === tab.id
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                : 'bg-zinc-800/80 hover:bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAddEvidence} className="mb-6 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Attach Verified Artifact / Claim</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Skill Name</label>
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                placeholder="e.g. PostgreSQL, Redis, Docker"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Evidence / Proof</label>
              <input
                type="text"
                value={newEvidence}
                onChange={e => setNewEvidence(e.target.value)}
                placeholder="e.g. Built multi-tier cache handling 10k RPS"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Verification Source</label>
              <select
                value={newSource}
                onChange={e => setNewSource(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
              >
                <option value="GitHub repository">GitHub repository (High)</option>
                <option value="Live production URL">Live production URL (High)</option>
                <option value="Course certificate">Course certificate (Medium)</option>
                <option value="Collegiate project">Collegiate project (Medium)</option>
                <option value="User claim">User claim (Needs Verification)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl text-xs"
            >
              Commit to Graph
            </button>
          </div>
        </form>
      )}

      {/* Nodes List */}
      <div className="space-y-3">
        {filtered.map(node => {
          let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
          let statusBadge = 'bg-emerald-500/20 text-emerald-300';
          if (node.confidence === 'Needs Verification') {
            badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            statusBadge = 'bg-amber-500/20 text-amber-300';
          } else if (node.confidence === 'Medium') {
            badgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
            statusBadge = 'bg-sky-500/20 text-sky-300';
          }

          return (
            <div
              key={node.id}
              onClick={() => onSkillClick && onSkillClick(node.skill)}
              className="p-4 bg-zinc-950/70 border border-zinc-800/90 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
            >
              {/* Chain: Skill -> Evidence -> Source */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-100">{node.skill}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {node.confidence} Confidence
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge}`}>
                    {node.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
                  <span className="text-zinc-500">↳ Evidence:</span>
                  <span className="text-zinc-300 font-medium">{node.evidence}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">Source:</span>
                  <span className="text-orange-400 font-mono text-[11px]">{node.source}</span>
                </div>
              </div>

              {/* Action hint */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                {node.confidence === 'Needs Verification' ? (
                  <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-medium">
                    ⚠️ Needs Assessment
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium">
                    ✓ ATS Verified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
