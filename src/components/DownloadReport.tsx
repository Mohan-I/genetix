// src/components/DownloadReport.tsx
import React, { useState, useRef } from 'react';
import { Download, FileText, Image, FileJson, ChevronDown, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

type ExportFormat = 'txt' | 'pdf' | 'png' | 'json';

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
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const generateHTMLContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Genetix Report - ${new Date().toLocaleString()}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background: #282828;
    }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0c 0%, #0f0f13 100%);
      padding: 40px;
      color: #e0e0e0;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: rgba(10, 10, 12, 0.95);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid rgba(16, 185, 129, 0.3);
    }
    .header h1 {
      font-size: 28px;
      letter-spacing: 4px;
      color: #10b981;
      margin-bottom: 8px;
    }
    .header p {
      color: #6b7280;
      font-size: 11px;
      letter-spacing: 2px;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .section h2 {
      font-size: 16px;
      color: #10b981;
      margin-bottom: 15px;
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section h3 {
      font-size: 12px;
      color: #9ca3af;
      margin: 12px 0 8px 0;
      letter-spacing: 1px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin: 15px 0;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 15px;
      border-radius: 4px;
    }
    .card h4 {
      color: #10b981;
      font-size: 11px;
      margin-bottom: 8px;
    }
    .risk-high {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
      padding: 10px;
      border-left: 3px solid #ef4444;
    }
    .risk-moderate {
      color: #f59e0b;
      background: rgba(245, 158, 11, 0.1);
      padding: 10px;
      border-left: 3px solid #f59e0b;
    }
    .risk-low {
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      padding: 10px;
      border-left: 3px solid #10b981;
    }
    .probability-bar {
      background: rgba(255, 255, 255, 0.1);
      height: 4px;
      border-radius: 2px;
      margin: 8px 0;
      overflow: hidden;
    }
    .probability-fill {
      background: #10b981;
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 11px;
    }
    th {
      color: #10b981;
      font-weight: normal;
      letter-spacing: 1px;
    }
    .footer {
      background: rgba(0, 0, 0, 0.3);
      padding: 20px;
      text-align: center;
      font-size: 9px;
      color: #6b7280;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 8px;
      border-radius: 3px;
      margin-left: 8px;
      letter-spacing: 1px;
    }
    .badge-mendelian {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .badge-polygenic {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>GENETIX PROBABILITY ENGINE</h1>
      <p>Bayesian v4.2 • Mendelian Inheritance • Polygenic Risk Scoring</p>
      <p style="margin-top: 10px; font-size: 10px;">Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="content">
      <!-- Parent Profiles -->
      <div class="section">
        <h2>📊 PARENT PROFILES</h2>
        <div class="grid">
          <div class="card">
            <h4>Mother (Alpha)</h4>
            <table>
              <tr><td>Blood Type:</td><td><strong>${p1.bloodType}</strong></td></tr>
              <tr><td>Eye Color:</td><td><strong>${p1.eyeColor}</strong></td></tr>
              <tr><td>Thalassemia:</td><td>${p1.thalassemia}</td></tr>
              <tr><td>Color Blindness:</td><td>${p1.colorBlindness ? 'Yes' : 'No'}</td></tr>
              <tr><td>Myopia:</td><td>${p1.myopia ? 'Yes' : 'No'}</td></tr>
              <tr><td>Diabetes T2:</td><td>${p1.diabetesT2 ? 'Yes' : 'No'}</td></tr>
              <tr><td>Age:</td><td>${p1.maternalHealth?.age} years</td></tr>
              <tr><td>BP:</td><td>${p1.maternalHealth?.systolicBP}/${p1.maternalHealth?.diastolicBP}</td></tr>
              <tr><td>Glucose:</td><td>${p1.maternalHealth?.glucoseLevel} mg/dL</td></tr>
            </table>
          </div>
          <div class="card">
            <h4>Father (Beta)</h4>
            <table>
              <tr><td>Blood Type:</td><td><strong>${p2.bloodType}</strong></td></tr>
              <tr><td>Eye Color:</td><td><strong>${p2.eyeColor}</strong></td></tr>
              <tr><td>Thalassemia:</td><td>${p2.thalassemia}</td></tr>
              <tr><td>Color Blindness:</td><td>${p2.colorBlindness ? 'Yes' : 'No'}</td></tr>
              <tr><td>Myopia:</td><td>${p2.myopia ? 'Yes' : 'No'}</td></tr>
              <tr><td>Diabetes T2:</td><td>${p2.diabetesT2 ? 'Yes' : 'No'}</td></tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Blood Type Distribution -->
      <div class="section">
        <h2>🩸 ABO/RH BLOOD DISTRIBUTION</h2>
        <div class="grid">
          ${bloodProbabilities.map(p => `
            <div class="card">
              <h4>${p.label}</h4>
              <div style="font-size: 24px; font-weight: bold; color: #10b981;">${(p.probability * 100).toFixed(1)}%</div>
              <div class="probability-bar">
                <div class="probability-fill" style="width: ${(p.probability * 100)}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Eye Color Distribution -->
      <div class="section">
        <h2>👁️ EYE COLOR DISTRIBUTION</h2>
        <div class="grid">
          ${eyeProbabilities.map(p => `
            <div class="card">
              <h4>${p.label}</h4>
              <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${(p.probability * 100).toFixed(1)}%</div>
              <div class="probability-bar">
                <div class="probability-fill" style="width: ${(p.probability * 100)}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Rh Compatibility -->
      <div class="section">
        <h2>⚠️ BLOOD GROUP COMPATIBILITY</h2>
        <div class="${rhRisk.isAtRisk ? 'risk-high' : 'risk-low'}">
          <strong>${rhRisk.isAtRisk ? '⚠️ Rh Incompatibility Detected' : '✓ Rh Compatible'}</strong>
          <p style="margin-top: 8px; font-size: 11px;">${rhRisk.message}</p>
          ${rhRisk.isAtRisk && rhRisk.recommendations ? `
            <div style="margin-top: 10px;">
              <strong>Recommendations:</strong>
              <ul style="margin-top: 5px; margin-left: 20px;">
                ${rhRisk.recommendations.map((rec: string) => `<li style="margin: 4px 0;">${rec}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Maternal Risk Assessment -->
      <div class="section">
        <h2>🤰 MATERNAL RISK ASSESSMENT</h2>
        <div class="${pregnancyRisk.status === 'HIGH' ? 'risk-high' : pregnancyRisk.status === 'MODERATE' ? 'risk-moderate' : 'risk-low'}">
          <strong>Status: ${pregnancyRisk.status} RISK (Score: ${pregnancyRisk.riskScore})</strong>
          <ul style="margin-top: 10px; margin-left: 20px;">
            ${pregnancyRisk.notes.map((note: string) => `<li style="margin: 4px 0;">${note}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Pathology Risks -->
      <div class="section">
        <h2>🧬 GENETIC RISK ASSESSMENT</h2>
        <div class="grid">
          ${pathologyRisks.map(risk => `
            <div class="card">
              <h4>${risk.label} <span class="badge ${risk.carrier !== undefined ? 'badge-mendelian' : 'badge-polygenic'}">${risk.carrier !== undefined ? 'Mendelian' : 'Polygenic'}</span></h4>
              <div style="font-size: 32px; font-weight: bold; color: ${risk.affected > 0.3 ? '#ef4444' : risk.affected > 0.15 ? '#f59e0b' : '#10b981'};">${(risk.affected * 100).toFixed(1)}%</div>
              ${risk.carrier !== undefined ? `<div style="font-size: 11px; margin-top: 5px;">Carrier: ${(risk.carrier * 100).toFixed(1)}%</div>` : ''}
              <div class="probability-bar" style="margin-top: 8px;">
                <div class="probability-fill" style="width: ${(risk.affected * 100)}%; background: ${risk.affected > 0.3 ? '#ef4444' : risk.affected > 0.15 ? '#f59e0b' : '#10b981'};"></div>
              </div>
              <p style="font-size: 9px; color: #9ca3af; margin-top: 8px;">${risk.description}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- AI Analysis -->
      ${aiAnalysis ? `
        <div class="section">
          <h2>🤖 AI-GENERATED ANALYSIS</h2>
          <div class="card">
            <div style="font-size: 11px; line-height: 1.6;">${aiAnalysis.replace(/\n/g, '<br/>')}</div>
          </div>
        </div>
      ` : ''}

      <!-- Disclaimer -->
      <div class="section">
        <h2>⚕️ DISCLAIMER</h2>
        <div class="card" style="background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2);">
          <p style="font-size: 10px; line-height: 1.5;">
            This report is generated for educational purposes only. Genetic outcomes are probabilistic and actual results may vary. 
            Not intended for clinical decision-making. Always consult with qualified healthcare providers for medical advice.
          </p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>GENETIX v4.2 | Bayesian ML | Ethical AI</p>
      <p style="margin-top: 5px;">© 2024 Genetix Probability Engine - Research & Education Platform</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const generateTXTContent = () => {
    return `
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
  };

  const generateJSONContent = () => {
    return JSON.stringify({
      metadata: {
        generated: new Date().toISOString(),
        version: "4.2",
        engine: "Genetix Probability Engine"
      },
      parents: {
        mother: {
          bloodType: p1.bloodType,
          eyeColor: p1.eyeColor,
          thalassemia: p1.thalassemia,
          colorBlindness: p1.colorBlindness,
          myopia: p1.myopia,
          diabetesT2: p1.diabetesT2,
          maternalHealth: p1.maternalHealth
        },
        father: {
          bloodType: p2.bloodType,
          eyeColor: p2.eyeColor,
          thalassemia: p2.thalassemia,
          colorBlindness: p2.colorBlindness,
          myopia: p2.myopia,
          diabetesT2: p2.diabetesT2
        }
      },
      probabilities: {
        bloodType: bloodProbabilities,
        eyeColor: eyeProbabilities
      },
      risks: {
        rhCompatibility: rhRisk,
        pregnancy: pregnancyRisk,
        pathologies: pathologyRisks
      },
      analysis: aiAnalysis
    }, null, 2);
  };

  const exportAsTXT = () => {
    const content = generateTXTContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genetix_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const htmlContent = generateHTMLContent();
      const win = window.open();
      if (win) {
        win.document.write(htmlContent);
        win.document.close();
        win.print();
      }
    } finally {
      setIsExporting(false);
    }
    setIsOpen(false);
  };

  const exportAsPNG = async () => {
    setIsExporting(true);
    try {
      const htmlContent = generateHTMLContent();
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      
      iframe.contentWindow?.document.write(htmlContent);
      iframe.contentWindow?.document.close();
      
      setTimeout(async () => {
        const canvas = await html2canvas(iframe.contentDocument!.body, {
          scale: 2,
          backgroundColor: '#0a0a0c',
          logging: false
        });
        
        const link = document.createElement('a');
        link.download = `genetix_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        document.body.removeChild(iframe);
        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error('PNG export failed:', error);
      setIsExporting(false);
    }
    setIsOpen(false);
  };

  const exportAsJSON = () => {
    const content = generateJSONContent();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genetix_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const handleExport = (format: ExportFormat) => {
    switch (format) {
      case 'txt':
        exportAsTXT();
        break;
      case 'pdf':
        exportAsPDF();
        break;
      case 'png':
        exportAsPNG();
        break;
      case 'json':
        exportAsJSON();
        break;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 text-[10px] font-mono uppercase tracking-wider transition-all rounded-sm disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            Export Report
            <ChevronDown className="w-3 h-3 ml-1" />
          </>
        )}
      </button>

      {isOpen && !isExporting && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0c] border border-white/10 rounded-sm shadow-xl z-50 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-[11px] text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                Export as PDF
              </button>
              {/* <button
                onClick={() => handleExport('png')}
                className="w-full px-4 py-2 text-left text-[11px] text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <Image className="w-3.5 h-3.5" />
                Export as PNG
              </button> */}
              <button
                onClick={() => handleExport('txt')}
                className="w-full px-4 py-2 text-left text-[11px] text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                Export as TXT
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full px-4 py-2 text-left text-[11px] text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2 border-t border-white/5"
              >
                <FileJson className="w-3.5 h-3.5" />
                Export as JSON
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};