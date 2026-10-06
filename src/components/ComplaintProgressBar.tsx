import React from 'react';
import { Complaint, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Check, 
  AlertCircle,
  Truck
} from 'lucide-react';

interface ComplaintProgressBarProps {
  complaint: Complaint;
  language: Language;
  compact?: boolean;
}

export const ComplaintProgressBar: React.FC<ComplaintProgressBarProps> = ({
  complaint,
  language,
  compact = false
}) => {
  const status = complaint.status || 'new';

  // Determine stage: 1 = Pending (new), 2 = In-Progress (assigned, in_progress, verification_pending), 3 = Resolved
  let currentStage = 1;
  let statusBadgeKey: 'statusPending' | 'statusInProgress' | 'statusResolved' = 'statusPending';
  let badgeClasses = 'bg-slate-50 text-slate-900 border-slate-200';
  let progressPercent = 15;

  if (status === 'resolved') {
    currentStage = 3;
    statusBadgeKey = 'statusResolved';
    badgeClasses = 'bg-emerald-50 text-emerald-900 border-emerald-300';
    progressPercent = 100;
  } else if (status === 'in_progress' || status === 'assigned' || status === 'verification_pending') {
    currentStage = 2;
    statusBadgeKey = 'statusInProgress';
    badgeClasses = 'bg-blue-50 text-blue-900 border-blue-300';
    progressPercent = 60;
  } else {
    currentStage = 1;
    statusBadgeKey = 'statusPending';
    badgeClasses = 'bg-slate-50 text-slate-900 border-slate-200';
    progressPercent = 15;
  }

  const steps = [
    {
      num: 1,
      title: getTranslation('step1Title', language),
      desc: complaint.reportedAt || getTranslation('step1Desc', language),
      icon: Clock,
      completed: currentStage >= 1,
      active: currentStage === 1
    },
    {
      num: 2,
      title: getTranslation('step2Title', language),
      desc: complaint.assignedAgency || getTranslation('step2Desc', language),
      icon: Truck,
      completed: currentStage >= 2,
      active: currentStage === 2
    },
    {
      num: 3,
      title: getTranslation('step3Title', language),
      desc: status === 'resolved' 
        ? (language === 'mr' ? 'दुरुस्ती मंजूर' : 'Approved') 
        : getTranslation('step3Desc', language),
      icon: CheckCircle2,
      completed: currentStage === 3,
      active: currentStage === 3
    }
  ];

  return (
    <div className="w-full space-y-3 pt-1">
      {/* Top Strip: Visual Status Badge + Ticket info */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Visual Status Indicator Sharp Box */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-black border shadow-2xs ${badgeClasses}`}>
            {currentStage === 1 && <Clock className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />}
            {currentStage === 2 && <Wrench className="w-3.5 h-3.5 text-blue-700 animate-spin shrink-0" />}
            {currentStage === 3 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
            <span>{getTranslation(statusBadgeKey, language)}</span>
          </span>

          <span className="text-xs text-slate-900 font-mono font-black">
            #{complaint.ticketNumber}
          </span>
        </div>

        {/* Live SLA remaining indicator */}
        <span className="text-[11px] font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-none border border-slate-200">
          {language === 'mr' ? 'अपेक्षित निवारण:' : 'Target SLA:'} <strong className="text-[#0284c7]">{complaint.slaHoursRemaining || 24}h</strong>
        </span>
      </div>

      {/* Step Progress Track */}
      <div className="relative py-2">
        {/* Background track line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-[#f1f5f9] rounded-none -translate-y-1/2 z-0" />
        
        {/* Animated Active colored progress bar */}
        <div 
          className="absolute top-5 left-6 h-1 bg-[#002b49] rounded-none -translate-y-1/2 transition-all duration-700 ease-out z-0"
          style={{ width: `calc(${progressPercent}% - 24px)` }}
        />

        {/* 3 Step Nodes */}
        <div className="relative z-10 flex justify-between items-start">
          {steps.map((st) => {
            const Icon = st.icon;
            const isDone = st.completed && currentStage > st.num;
            const isCurrent = currentStage === st.num;

            return (
              <div 
                key={st.num} 
                className="flex flex-col items-center text-center max-w-[100px] sm:max-w-[130px]"
              >
                {/* Node Sharp Box */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-none flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-[#002b49] text-white shadow-xs'
                      : isCurrent
                        ? 'bg-slate-50 text-slate-900 border-2 border-[#0284c7] font-black'
                        : 'bg-white text-slate-400 border-2 border-[#e2e8f0]'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Step Title & Details */}
                <div className="mt-1.5">
                  <div className={`text-[11px] sm:text-xs font-black leading-tight ${
                    isCurrent 
                      ? 'text-slate-900' 
                      : isDone 
                        ? 'text-slate-800' 
                        : 'text-slate-400'
                  }`}>
                    {st.title}
                  </div>
                  {!compact && (
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {st.desc}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
