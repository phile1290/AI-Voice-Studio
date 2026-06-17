import React from 'react';
import { VoiceProfile, AgeGroup, VoiceGender } from '../types';
import { User, Baby, Armchair, Mic2 } from 'lucide-react';

interface VoiceCardProps {
  profile: VoiceProfile;
  isSelected: boolean;
  onSelect: (profile: VoiceProfile) => void;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ profile, isSelected, onSelect }) => {
  
  const getIcon = () => {
    if (profile.ageGroup === AgeGroup.CHILD) return <Baby className="w-6 h-6" />;
    if (profile.ageGroup === AgeGroup.SENIOR) return <Armchair className="w-6 h-6" />;
    return <User className="w-6 h-6" />;
  };

  const getGenderColor = () => {
    return profile.gender === VoiceGender.FEMALE ? 'text-pink-400' : 'text-blue-400';
  };

  const translateGender = (gender: VoiceGender) => {
    return gender === VoiceGender.FEMALE ? 'Nữ' : 'Nam';
  };

  return (
    <div 
      onClick={() => onSelect(profile)}
      className={`
        relative overflow-hidden cursor-pointer rounded-xl border-2 transition-all duration-300 p-4
        ${isSelected 
          ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg bg-slate-900/50 ${getGenderColor()}`}>
          {getIcon()}
        </div>
        {isSelected && (
          <div className="flex items-center text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-full">
            <Mic2 className="w-3 h-3 mr-1" />
            Đang chọn
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{profile.displayName}</h3>
      <div className="flex gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">
          {profile.tone}
        </span>
        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">
          {translateGender(profile.gender)}
        </span>
      </div>
      
      <p className="text-sm text-slate-400 leading-relaxed">
        {profile.description}
      </p>
    </div>
  );
};

export default VoiceCard;