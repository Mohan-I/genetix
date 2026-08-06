// src/components/DownloadReport.tsx
import React, { useState, useRef } from 'react';
import { Download, FileText, Image, FileJson, ChevronDown, Check, X } from 'lucide-react';
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
  const [exportSuccess, setExportSuccess] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateHTMLContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Genetix Report - ${new Date().toLocaleString()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0c 0%, #0f0f13 100%);
      padding: 20px;
      color: #e0e0e0;
      min-height: 100vh;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: #0a0a0c;
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
    }
    .header {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(20, 184, 166, 0.06) 100%);
      padding: 35px 40px 30px;
      text-align: center;
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #10b981, transparent);
    }
    .header .logo {
      display: inline-block;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #10b981, #14b8a6);
      border-radius: 8px;
      line-height: 48px;
      font-size: 24px;
      font-weight: 700;
      color: #0a0a0c;
      margin-bottom: 12px;
    }
    .header h1 {
      font-size: 26px;
      letter-spacing: 6px;
      color: #10b981;
      font-weight: 300;
      margin-bottom: 6px;
    }
    .header .subtitle {
      color: #6b7280;
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    .header .timestamp {
      color: #4b5563;
      font-size: 10px;
      margin-top: 10px;
      letter-spacing: 1px;
    }
    .content { padding: 35px 40px; }
    .section {
      margin-bottom: 32px;
      padding-bottom: 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .section:last-child { border-bottom: none; margin-bottom: 0; }
    .section-title {
      font-size: 14px;
      color: #10b981;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 400;
    }
    .section-title .line {
      flex: 1;
      height: 1px;
      background: rgba(16, 185, 129, 0.2);
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 16px 18px;
      border-radius: 8px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: rgba(16, 185, 129, 0.15); }
    .card-label {
      color: #9ca3af;
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .card-value {
      font-size: 20px;
      font-weight: 300;
      color: #f3f4f6;
    }
    .card-value .unit {
      font-size: 12px;
      color: #6b7280;
      margin-left: 4px;
    }
    .probability-bar {
      background: rgba(255, 255, 255, 0.08);
      height: 3px;
      border-radius: 2px;
      margin-top: 8px;
      overflow: hidden;
    }
    .probability-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.6s ease;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      font-size: 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-left: 8px;
      font-weight: 600;
    }
    .badge-mendelian {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .badge-polygenic {
      background: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    .risk-box {
      padding: 14px 18px;
      border-radius: 8px;
      border-left: 3px solid;
    }
    .risk-high { background: rgba(239, 68, 68, 0.08); border-color: #ef4444; color: #fca5a5; }
    .risk-moderate { background: rgba(245, 158, 11, 0.08); border-color: #f59e0b; color: #fcd34d; }
    .risk-low { background: rgba(16, 185, 129, 0.08); border-color: #10b981; color: #6ee7b7; }
    .risk-box strong { color: #fff; }
    .risk-box ul { margin-top: 8px; padding-left: 20px; }
    .risk-box ul li { margin: 4px 0; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 4px 0; font-size: 11px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); }
    td:first-child { color: #9ca3af; width: 40%; }
    td:last-child { color: #e5e7eb; }
    .analysis-text {
      font-size: 11px;
      line-height: 1.8;
      color: #d1d5db;
      padding: 16px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer {
      background: rgba(0, 0, 0, 0.3);
      padding: 20px 40px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer p {
      font-size: 9px;
      color: #4b5563;
      letter-spacing: 1px;
    }
    .footer .brand {
      color: #10b981;
      font-weight: 600;
    }
    .disclaimer {
      font-size: 9px;
      line-height: 1.6;
      color: #6b7280;
      padding: 16px 18px;
      background: rgba(239, 68, 68, 0.04);
      border: 1px solid rgba(239, 68, 68, 0.1);
      border-radius: 8px;
    }
    @media (max-width: 768px) {
      .grid-2 { grid-template-columns: 1fr; }
      .content { padding: 20px; }
      .header { padding: 25px 20px; }
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">G</div>
      <h1>GENETIX</h1>
      <div class="subtitle">Probabilistic Inheritance Engine</div>
      <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
    </div>
    
    <div class="content">
      <!-- Parent Profiles -->
      <div class="section">
        <div class="section-title">Parent Profiles <span class="line"></span></div>
        <div class="grid-2">
          <div class="card">
            <div class="card-label">Mother (Alpha)</div>
            <table>
              <tr><td>Blood Type</td><td><strong>${p1.bloodType}</strong></td></tr>
              <tr><td>Eye Color</td><td><strong>${p1.eyeColor}</strong></td></tr>
              <tr><td>Thalassemia</td><td>${p1.thalassemia}</td></tr>
              <tr><td>Color Blindness</td><td>${p1.colorBlindness ? 'Yes' : 'No'}</td></tr>
              <tr><td>Myopia</td><td>${p1.myopia ? 'Yes' : 'No'}</td></tr>
              <tr><td>Diabetes T2</td><td>${p1.diabetesT2 ? 'Yes' : 'No'}</td></tr>
              <tr><td>Age</td><td>${p1.maternalHealth?.age} years</td></tr>
              <tr><td>BP</td><td>${p1.maternalHealth?.systolicBP}/${p1.maternalHealth?.diastolicBP}</td></tr>
              <tr><td>Glucose</td><td>${p1.maternalHealth?.glucoseLevel} mg/dL</td></tr>
            </table>
          </div>
          <div class="card">
            <div class="card-label">Father (Beta)</div>
            <table>
              <tr><td>Blood Type</td><td><strong>${p2.bloodType}</strong></td></tr>
              <tr><td>Eye Color</td><td><strong>${p2.eyeColor}</strong></td></tr>
              <tr><td>Thalassemia</td><td>${p2.thalassemia}</td></tr>
              <tr><td>Color Blindness</td><td>${p2.colorBlindness ? 'Yes' : 'No'}</td></tr>
              <tr><td>Myopia</td><td>${p2.myopia ? 'Yes' : 'No'}</td></tr>
              <tr><td>Diabetes T2</td><td>${p2.diabetesT2 ? 'Yes' : 'No'}</td></tr>
            </table>
          </div>
        </div>
      </div>

      <!-- Blood Type -->
      <div class="section">
        <div class="section-title">ABO/Rh Blood Distribution <span class="line"></span></div>
        <div class="grid-3">
          ${bloodProbabilities.map(p => `
            <div class="card">
              <div class="card-label">${p.label}</div>
              <div class="card-value">${(p.probability * 100).toFixed(1)}<span class="unit">%</span></div>
              <div class="probability-bar"><div class="probability-fill" style="width: ${p.probability * 100}%; background: #10b981;"></div></div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Eye Color -->
      <div class="section">
        <div class="section-title">Eye Color Distribution <span class="line"></span></div>
        <div class="grid-3">
          ${eyeProbabilities.map(p => `
            <div class="card">
              <div class="card-label">${p.label}</div>
              <div class="card-value">${(p.probability * 100).toFixed(1)}<span class="unit">%</span></div>
              <div class="probability-bar"><div class="probability-fill" style="width: ${p.probability * 100}%; background: #3b82f6;"></div></div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Rh Compatibility -->
      <div class="section">
        <div class="section-title">Blood Group Compatibility <span class="line"></span></div>
        <div class="risk-box ${rhRisk.isAtRisk ? 'risk-high' : 'risk-low'}">
          <strong>${rhRisk.isAtRisk ? '⚠️ Rh Incompatibility Detected' : '✓ Rh Compatible'}</strong>
          <p style="margin-top: 6px; font-size: 11px;">${rhRisk.message}</p>
          ${rhRisk.isAtRisk && rhRisk.recommendations ? `
            <div style="margin-top: 10px;">
              <strong style="font-size: 10px;">Recommendations:</strong>
              <ul>${rhRisk.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Maternal Risk -->
      <div class="section">
        <div class="section-title">Maternal Risk Assessment <span class="line"></span></div>
        <div class="risk-box ${pregnancyRisk.status === 'HIGH' ? 'risk-high' : pregnancyRisk.status === 'MODERATE' ? 'risk-moderate' : 'risk-low'}">
          <strong>Status: ${pregnancyRisk.status} RISK</strong>
          <span style="font-size: 11px; margin-left: 10px;">Score: ${pregnancyRisk.riskScore}</span>
          <ul>
            ${pregnancyRisk.notes.map((note: string) => `<li>${note}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Pathology Risks -->
      <div class="section">
        <div class="section-title">Genetic Risk Assessment <span class="line"></span></div>
        <div class="grid-3">
          ${pathologyRisks.map(risk => `
            <div class="card">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span class="card-label">${risk.label}</span>
                <span class="badge ${risk.carrier !== undefined ? 'badge-mendelian' : 'badge-polygenic'}">${risk.carrier !== undefined ? 'Mendelian' : 'Polygenic'}</span>
              </div>
              <div class="card-value" style="color: ${risk.affected > 0.3 ? '#ef4444' : risk.affected > 0.15 ? '#f59e0b' : '#10b981'};">${(risk.affected * 100).toFixed(1)}<span class="unit">%</span></div>
              ${risk.carrier !== undefined ? `<div style="font-size: 10px; color: #9ca3af; margin-top: 2px;">Carrier: ${(risk.carrier * 100).toFixed(1)}%</div>` : ''}
              <div class="probability-bar"><div class="probability-fill" style="width: ${risk.affected * 100}%; background: ${risk.affected > 0.3 ? '#ef4444' : risk.affected > 0.15 ? '#f59e0b' : '#10b981'};"></div></div>
              <div style="font-size: 9px; color: #6b7280; margin-top: 6px;">${risk.description}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- AI Analysis -->
      ${aiAnalysis ? `
        <div class="section">
          <div class="section-title">AI-Generated Analysis <span class="line"></span></div>
          <div class="analysis-text">${aiAnalysis.replace(/\n/g, '<br/>')}</div>
        </div>
      ` : ''}

      <!-- Disclaimer -->
      <div class="section" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">
        <div class="section-title">Disclaimer <span class="line"></span></div>
        <div class="disclaimer">
          This report is generated for <strong>educational purposes only</strong>. Genetic outcomes are probabilistic and actual results may vary. 
          Not intended for clinical decision-making. Always consult with qualified healthcare providers for medical advice.
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><span class="brand">GENETIX</span> v4.2 &bull; Bayesian ML &bull; Ethical AI</p>
      <p style="margin-top: 4px;">© 2024 Genetix Probability Engine &bull; Research &amp; Education Platform</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const generateTXTContent = () => {
    const lines = [
      '='.repeat(60),
      'GENETIX PROBABILITY ENGINE - COMPREHENSIVE REPORT',
      '='.repeat(60),
      `Generated: ${new Date().toLocaleString()}`,
      '',
      'PARENT PROFILES',
      '-'.repeat(50),
      '',
      'Mother (Alpha):',
      `  Blood Type: ${p1.bloodType}`,
      `  Eye Color: ${p1.eyeColor}`,
      `  Thalassemia: ${p1.thalassemia}`,
      `  Color Blindness: ${p1.colorBlindness ? 'Yes' : 'No'}`,
      `  Myopia: ${p1.myopia ? 'Yes' : 'No'}`,
      `  Diabetes T2: ${p1.diabetesT2 ? 'Yes' : 'No'}`,
      `  Age: ${p1.maternalHealth?.age} years`,
      `  Blood Pressure: ${p1.maternalHealth?.systolicBP}/${p1.maternalHealth?.diastolicBP}`,
      `  Glucose: ${p1.maternalHealth?.glucoseLevel} mg/dL`,
      '',
      'Father (Beta):',
      `  Blood Type: ${p2.bloodType}`,
      `  Eye Color: ${p2.eyeColor}`,
      `  Thalassemia: ${p2.thalassemia}`,
      `  Color Blindness: ${p2.colorBlindness ? 'Yes' : 'No'}`,
      `  Myopia: ${p2.myopia ? 'Yes' : 'No'}`,
      `  Diabetes T2: ${p2.diabetesT2 ? 'Yes' : 'No'}`,
      '',
      'BLOOD TYPE DISTRIBUTION',
      '-'.repeat(50),
      ...bloodProbabilities.map(p => `${p.label}: ${(p.probability * 100).toFixed(1)}%`),
      '',
      'EYE COLOR DISTRIBUTION',
      '-'.repeat(50),
      ...eyeProbabilities.map(p => `${p.label}: ${(p.probability * 100).toFixed(1)}%`),
      '',
      'RH COMPATIBILITY',
      '-'.repeat(50),
      `Status: ${rhRisk.isAtRisk ? '⚠️ INCOMPATIBLE - Requires RhoGAM' : '✓ Compatible'}`,
      rhRisk.isAtRisk ? `Message: ${rhRisk.message}` : '',
      '',
      'MATERNAL RISK ASSESSMENT',
      '-'.repeat(50),
      `Status: ${pregnancyRisk.status} RISK`,
      `Risk Score: ${pregnancyRisk.riskScore}`,
      'Notes:',
      ...pregnancyRisk.notes.map(n => `  - ${n}`),
      '',
      'PATHOLOGY RISK ASSESSMENT',
      '-'.repeat(50),
      ...pathologyRisks.map(risk => [
        `${risk.label}:`,
        `  Affected Risk: ${(risk.affected * 100).toFixed(1)}%`,
        risk.carrier ? `  Carrier Risk: ${(risk.carrier * 100).toFixed(1)}%` : '',
        `  Description: ${risk.description}`,
        ''
      ]).flat(),
      'AI-GENERATED ANALYSIS',
      '-'.repeat(50),
      aiAnalysis || 'No AI analysis available',
      '',
      'DISCLAIMER',
      '-'.repeat(50),
      'This report is generated for educational purposes only.',
      'Genetic outcomes are probabilistic and actual results may vary.',
      'Not intended for clinical decision-making.',
      '',
      '='.repeat(60),
      'Genetix Probability Engine v4.2 | Bayesian ML | Ethical AI',
      '© 2024 Genetix - Research & Education Platform',
      '='.repeat(60)
    ];

    return lines.join('\n');
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
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genetix_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
    setIsOpen(false);
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const htmlContent = generateHTMLContent();
      const win = window.open('', '_blank', 'width=1100,height=800,scrollbars=yes');
      if (win) {
        win.document.write(htmlContent);
        win.document.close();
        win.onload = () => {
          setTimeout(() => {
            win.print();
            setIsExporting(false);
            setIsOpen(false);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
          }, 500);
        };
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      setIsExporting(false);
    }
  };

  const exportAsJSON = () => {
    const content = generateJSONContent();
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genetix_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
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
      case 'json':
        exportAsJSON();
        break;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider transition-all rounded-sm disabled:opacity-50 whitespace-nowrap"
      >
        {isExporting ? (
          <>
            <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <span className="hidden xs:inline">Exporting...</span>
          </>
        ) : exportSuccess ? (
          <>
            <Check className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden xs:inline">Done!</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden xs:inline">Export</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && !isExporting && (
        <div className="absolute right-0 mt-1.5 min-w-[160px] sm:min-w-[180px] bg-[#0a0a0c] border border-white/10 rounded-md shadow-2xl z-50 overflow-hidden">
          <div className="py-1">
            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-3 sm:px-4 py-2 text-left text-[10px] sm:text-[11px] text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              Export as PDF
            </button>
            <button
              onClick={() => handleExport('txt')}
              className="w-full px-3 sm:px-4 py-2 text-left text-[10px] sm:text-[11px] text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
              Export as TXT
            </button>
            <button
              onClick={() => handleExport('json')}
              className="w-full px-3 sm:px-4 py-2 text-left text-[10px] sm:text-[11px] text-white/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors flex items-center gap-2 border-t border-white/5"
            >
              <FileJson className="w-3.5 h-3.5 flex-shrink-0" />
              Export as JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};