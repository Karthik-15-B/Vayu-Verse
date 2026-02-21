
import React from 'react';

export const ParticleBackground: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-emerald-100/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(16,185,129,0.06),transparent_50%)]" />
      </div>
    </div>
  );
};
