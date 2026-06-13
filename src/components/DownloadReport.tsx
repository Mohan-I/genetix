// src/components/DownloadReport.tsx
import React from 'react';
import { Download, FileText } from 'lucide-react';

interface DownloadReportProps {
  bloodProbabilities: any[];
  eyeProbabilities: any[];
  pathologyRisks: any[];
  rhRisk: any;
  pregnancyRisk: any;
  aiAnalysis: string | null;
  p1: any;
  p2: any;
}

export const DownloadReport: React.FC<DownloadReportProps> = ({
  bloodProbabilities,
  eyeProbabilities,
  pathologyRisks,
  rhRisk,
  pregnancyRisk,
  aiAnalysis,
  p1,
  p2
}) => {
  const generateReport = () => {
    const reportContent = `
GENETIX PROBABILITY ENGINE - COMPREHENSIVE REPORT
=================================================
Generated: ${new Date().toLocaleString()}

PARENT PROFILES
---------------
Mother (Alpha):
- Blood Type: ${p1.bloodType}
- Eye Color: ${p1.eyeColor}
- Thalassemia: ${p1.thalassemia}
- Color Blindness: ${p1.colorBlindness ? 'Yes' : 'No'}
- Myopia: ${p1.myopia ? 'Yes' : 'No'}
- Diabetes T2: ${p1.diabetesT2 ? 'Yes' : 'No'}
- Age: ${p1.maternalHealth?.age}
- Blood Pressure: ${p1.maternalHealth?.systolicBP}/${p1.maternalHealth?.diastolicBP}
- Glucose: ${p1.maternalHealth?.glucoseLevel} mg/dL

Father (Beta):
- Blood Type: ${p2.bloodType}
- Eye Color: ${p2.eyeColor}
- Thalassemia: ${p2.thalassemia}
- Color Blindness: ${p2.colorBlindness ? 'Yes' : 'No'}
- Myopia: ${p2.myopia ? 'Yes' : 'No'}
- Diabetes T2: ${p2.diabetesT2 ? 'Yes' : 'No'}

BLOOD TYPE DISTRIBUTION
-----------------------
${bloodProbabilities.map(p => `${p.label}: ${(p.probability * 100).toFixed(1)}%`).join('\n')}

EYE COLOR DISTRIBUTION
----------------------
${eyeProbabilities.map(p => `${p.label}: ${(p.probability * 100).toFixed(1)}%`).join('\n')}

RH COMPATIBILITY
----------------
Status: ${rhRisk.isAtRisk ? '⚠️ INCOMPATIBLE - Requires RhoGAM' : '✓ Compatible'}
${rhRisk.isAtRisk ? `Message: ${rhRisk.message}` : ''}

MATERNAL RISK ASSESSMENT
------------------------
Status: ${pregnancyRisk.status} RISK
Risk Score: ${pregnancyRisk.riskScore}
Notes:
${pregnancyRisk.notes.map(n => `- ${n}`).join('\n')}

PATHOLOGY RISK ASSESSMENT
-------------------------
${pathologyRisks.map(risk => `
${risk.label}:
- Affected Risk: ${(risk.affected * 100).toFixed(1)}%
${risk.carrier ? `- Carrier Risk: ${(risk.carrier * 100).toFixed(1)}%\n` : ''}- Description: ${risk.description}
`).join('\n')}

AI-GENERATED ANALYSIS
---------------------
${aiAnalysis || 'No AI analysis available'}

DISCLAIMER
----------
This report is generated for educational purposes only. 
Genetic outcomes are probabilistic and actual results may vary.
Not intended for clinical decision-making.

---
Genetix Probability Engine v4.2 | Bayesian ML | Ethical AI
    `;

    // Create and download the file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genetix_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generateReport}
      className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider transition-all rounded"
    >
      <Download className="w-3 h-3" />
      Download Report
    </button>
  );
};