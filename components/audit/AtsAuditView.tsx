'use client';

import React, { useState } from 'react';
import { AtsMetrics, SkillGap } from '@/types';
import { ScoreGauge } from '@/components/ui/ScoreGauge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  PlusCircle,
  BarChart3,
  Check,
  FileCheck2,
  Code2,
  BookOpen,
  XCircle
} from 'lucide-react';

export interface AtsAuditViewProps {
  atsMetrics: AtsMetrics;
  onAddSkillAsQuest: (skill: SkillGap) => void;
  onNavigateToQuests: () => void;
}

export const AtsAuditView: React.FC<AtsAuditViewProps> = ({
  atsMetrics,
  onAddSkillAsQuest,
  onNavigateToQuests,
}) => {
  const [addedSkills, setAddedSkills] = useState<Record<string, boolean>>({});

  const handleAddQuest = (skill: SkillGap) => {
    onAddSkillAsQuest(skill);
    setAddedSkills((prev) => ({ ...prev, [skill.id]: true }));
  };

  const matchedSkills = atsMetrics.skillGaps.filter((s) => s.category === 'Matched');
  const missingSkills = atsMetrics.skillGaps.filter((s) => s.category === 'Missing');

  return (
    <div className="space-y-6">
      {/* Top Banner & Readiness Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Readiness Gauge Card (5 cols) */}
        <Card variant="accent" className="lg:col-span-5 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Deterministic ATS Engine</h3>
              <p className="text-xs text-zinc-400">Zero-Cloud On-Device Score Analyzer</p>
            </div>
          </div>

          <div className="my-2">
            <ScoreGauge score={atsMetrics.score} rankTier={atsMetrics.rankTier} size={190} />
          </div>

          <div className="mt-4 w-full pt-4 border-t border-zinc-800 grid grid-cols-3 gap-2 text-center">
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <div className="text-[10px] font-mono text-zinc-400">Matched</div>
              <div className="text-sm font-bold font-mono text-emerald-400">{matchedSkills.length}</div>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <div className="text-[10px] font-mono text-zinc-400">Missing</div>
              <div className="text-sm font-bold font-mono text-red-400">{missingSkills.length}</div>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <div className="text-[10px] font-mono text-zinc-400">XYZ Compliance</div>
              <div className="text-sm font-bold font-mono text-amber-400">{atsMetrics.xyzFormulaAlignmentScore}%</div>
            </div>
          </div>
        </Card>

        {/* Breakdown & Alignment Meters (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Deterministic Alignment Metrics</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 text-orange-400 border border-zinc-700 font-bold">
                Tier: {atsMetrics.rankTier}
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Synthesized resume digest is audited against placement skill matrices (Full Stack, Systems, Microservices). 
              Completing missing skill remediation quests directly advances your score into the <strong className="text-emerald-400 font-mono">Job-Ready</strong> tier.
            </p>

            {/* Keyword Density & Formula Compliance Meters */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Google X-Y-Z Formula Action Indicator</span>
                  <span className="font-mono text-amber-400 font-bold">{atsMetrics.xyzFormulaAlignmentScore}% Compliance</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500 rounded-full"
                    style={{ width: `${atsMetrics.xyzFormulaAlignmentScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-zinc-300 font-medium">Keyword Density Match Percentage</span>
                  <span className="font-mono text-emerald-400 font-bold">{atsMetrics.keywordDensityScore}% Density</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${atsMetrics.keywordDensityScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-zinc-300 font-medium">ATS Parser Formatting Index</span>
                  <span className="font-mono text-orange-400 font-bold">{atsMetrics.formattingScore}% Structural Score</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500 rounded-full"
                    style={{ width: `${atsMetrics.formattingScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 mt-4">
            <Button
              variant="primary"
              className="w-full"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={onNavigateToQuests}
            >
              Open Remediation Quest Hub (Gain XP & Tier Up)
            </Button>
          </div>
        </Card>
      </div>

      {/* Matched vs. Missing Skill Chips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skill Chips */}
        <Card variant="accent" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-white">Matched Placement Skills</h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {matchedSkills.length} Verified
            </span>
          </div>

          {/* Matched chip style: bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded-md */}
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Missing Skill Chips (Interactive - Convert to Quest) */}
        <Card variant="accent" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-bold text-white">Identified Missing Skill Chips</h3>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              {missingSkills.length} Action Items
            </span>
          </div>

          {/* Missing skill chip style: bg-red-500/10 border-red-500/30 text-red-400 font-mono text-xs px-2.5 py-1 rounded-md */}
          <div className="space-y-3">
            {missingSkills.map((skill) => {
              const isAdded = addedSkills[skill.id] || skill.addedToQuests;

              return (
                <div
                  key={skill.id}
                  className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs px-2.5 py-1 rounded-md font-bold">
                        {skill.name}
                      </span>
                      {skill.leetCodePattern && (
                        <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-orange-400" />
                          Pattern: {skill.leetCodePattern}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">{skill.recommendation}</p>
                  </div>

                  <button
                    disabled={isAdded}
                    onClick={() => handleAddQuest(skill)}
                    className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                        : 'bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold shadow-sm active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added to Quests
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add as Quest (+100 XP)
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Google X-Y-Z Formula Checklist */}
      <Card variant="accent" className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Google X-Y-Z Formula Verification Checklist</h3>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Rule Compliance: {atsMetrics.xyzChecklist.filter((c) => c.passed).length}/{atsMetrics.xyzChecklist.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {atsMetrics.xyzChecklist.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                item.passed
                  ? 'bg-emerald-950/10 border-emerald-500/30'
                  : 'bg-red-950/10 border-red-500/30'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className={item.passed ? 'text-emerald-400' : 'text-red-400'}>{item.rule}</span>
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{item.feedback}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AtsAuditView;
