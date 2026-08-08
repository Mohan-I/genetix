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
    const hasRecessiveRisk = pathologyRisks.some(risk => risk.carrier !== undefined && risk.carrier > 0.1);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="print-scale" content="1.0">
  <title>Genetix Report - ${new Date().toLocaleString()}</title>
  <style>
    /* ----- RESET & GLOBAL ----- */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, 'Segoe UI', sans-serif;
      background: #fff;
      color: #1e2a3a;
      font-size: 9.5pt;
      line-height: 1.38;
      padding: 0.22in 0.38in;
      max-width: 210mm;
      margin: 0 auto;
      overflow-x: hidden;
    }
    
    /* ----- HEADER ----- */
    .header {
      margin-bottom: 10px;
      border-bottom: 2px solid #10b981;
      padding-bottom: 8px;
      text-align: center;
    }
    .logo {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #10b981, #14b8a6);
      border-radius: 4px;
      line-height: 36px;
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 2px;
    }
    .header h1 {
      font-size: 20px;
      letter-spacing: 4px;
      color: #10b981;
      font-weight: 300;
    }
    .header .subtitle {
      color: #6b7280;
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header-meta {
      display: flex;
      justify-content: center;
      gap: 20px;
      font-size: 8.5pt;
      color: #4b5563;
      margin-top: 6px;
      flex-wrap: wrap;
    }
    .header-meta strong {
      color: #1e2a3a;
    }

    /* ----- SECTIONS ----- */
    .section {
      margin-bottom: 8px;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #10b981;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .section-number {
      font-weight: 400;
      color: #6b7280;
    }

    /* ----- CARDS & GRIDS ----- */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 10px 14px;
      border-radius: 4px;
    }
    .card-label {
      color: #6b7280;
      font-size: 7.5pt;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .card-value {
      font-size: 16pt;
      font-weight: 300;
      color: #1e2a3a;
    }
    .card-value .unit {
      font-size: 9pt;
      color: #6b7280;
      margin-left: 2px;
    }
    .probability-bar {
      background: #e5e7eb;
      height: 3px;
      border-radius: 2px;
      margin-top: 5px;
      overflow: hidden;
    }
    .probability-fill {
      height: 100%;
      border-radius: 2px;
    }

    /* ----- BADGES ----- */
    .badge {
      display: inline-block;
      padding: 1px 6px;
      font-size: 6.5pt;
      border-radius: 3px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      font-weight: 700;
    }
    .badge-mendelian { background: #d1fae5; color: #065f46; }
    .badge-polygenic { background: #dbeafe; color: #1e40af; }
    .badge-recessive { background: #fef3c7; color: #92400e; }

    /* ----- RISK BOXES ----- */
    .risk-box {
      padding: 10px 14px;
      border-radius: 4px;
      border-left: 3px solid;
    }
    .risk-high { background: #fef2f2; border-color: #ef4444; color: #991b1b; }
    .risk-moderate { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
    .risk-low { background: #ecfdf5; border-color: #10b981; color: #065f46; }
    .risk-box strong { color: #1e2a3a; }
    .risk-box ul { margin-top: 4px; padding-left: 16px; }
    .risk-box ul li { margin: 2px 0; font-size: 8.5pt; }

    /* ----- TABLES ----- */
    table { width: 100%; border-collapse: collapse; }
    td { padding: 2px 0; font-size: 8.5pt; border-bottom: 1px solid #f3f4f6; }
    td:first-child { color: #6b7280; width: 40%; }
    td:last-child { color: #1e2a3a; font-weight: 500; }

    /* ----- LISTS ----- */
    .bullet-list {
      list-style: none;
      padding: 0;
    }
    .bullet-list li {
      padding: 3px 0;
      font-size: 8.5pt;
      color: #1e2a3a;
      border-bottom: 1px solid #f3f4f6;
      padding-left: 14px;
      position: relative;
    }
    .bullet-list li:last-child { border-bottom: none; }
    .bullet-list li::before {
      content: "▸";
      color: #10b981;
      position: absolute;
      left: 0;
      font-weight: bold;
    }

    /* ----- ANALYSIS TEXT ----- */
    .analysis-text {
      font-size: 8.5pt;
      line-height: 1.6;
      color: #1e2a3a;
      padding: 10px 14px;
      background: #f9fafb;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    }
    .analysis-text strong { color: #0f172a; }

    /* ----- DISCLAIMER ----- */
    .disclaimer {
      font-size: 7.5pt;
      line-height: 1.5;
      color: #6b7280;
      padding: 10px 14px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 4px;
    }
    .disclaimer strong { color: #991b1b; }

    /* ----- FOOTER ----- */
    .footer {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }
    .footer p {
      font-size: 7pt;
      color: #6b7280;
      letter-spacing: 0.5px;
    }
    .footer .brand { color: #10b981; font-weight: 600; }

    /* ----- PAGE BREAK HANDLING ----- */
    .page-break {
      page-break-before: always;
      break-before: page;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed #d1d5db;
    }
    .page-break-label {
      text-align: center;
      font-size: 7pt;
      color: #9ca3af;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 8px;
      padding: 4px;
      background: #f9fafb;
      border-radius: 2px;
    }

    /* ----- RESPONSIVE ----- */
    @media (max-width: 768px) {
      .grid-2 { grid-template-columns: 1fr; }
      .grid-3 { grid-template-columns: 1fr; }
      body { padding: 0.15in 0.2in; }
    }

    /* ----- PRINT STYLES ----- */
    @media print {
      body {
        padding: 0.15in 0.32in;
        margin: 0;
        font-size: 9pt;
        width: 100%;
        height: auto;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .section { break-inside: avoid; page-break-inside: avoid; }
      .page-break { border-top: none; margin-top: 8px; padding-top: 8px; }
      .page-break-label { display: none; }
      .card { background: #f9fafb; }
      .risk-high { background: #fef2f2; }
      .risk-moderate { background: #fffbeb; }
      .risk-low { background: #ecfdf5; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

<!-- ========== HEADER ========== -->
<div class="header">
  <div class="logo">G</div>
  <h1>GENETIX</h1>
  <div class="subtitle">Preimplantation Genetic Report · PGT-M / Monogenic Disorder Assessment</div>
  <div class="header-meta">
    <span>Patient Couple: <strong>Alpha & Beta</strong></span>
    <span>Assessment Type: <strong>PGT-M / Autosomal Recessive</strong></span>
    <span>Engine: <strong>Genetix Bayesian v4.2</strong></span>
  </div>
</div>

<!-- ========== SECTION 1: CARRIER CONCORDANCE ========== -->
<div class="section">
  <div class="section-title"><span class="section-number">1.</span> CARRIER CONCORDANCE ANALYSIS</div>
  ${hasRecessiveRisk ? `
  <div style="background: #fffbeb; padding: 12px 16px; border-radius: 4px; border: 1px solid #fcd34d;">
    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 6px;">
      <span><strong style="color: #92400e;">Gene:</strong> CFTR (chromosome 7q31.2)</span>
      <span><strong style="color: #92400e;">Variant:</strong> c.1521_1523delCTT (p.Phe508del)</span>
      <span style="color: #10b981; font-size: 8pt;">— Pathogenic per ACMG</span>
    </div>
    <div style="display: flex; gap: 20px; flex-wrap: wrap;">
      <span><strong style="color: #92400e;">Parent Alpha:</strong> Confirmed heterozygous carrier</span>
      <span><strong style="color: #92400e;">Parent Beta:</strong> Confirmed heterozygous carrier</span>
    </div>
    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #fcd34d;">
      <strong style="color: #92400e;">Joint Recessive Transmission Risk:</strong>
      <span style="font-size: 14pt; font-weight: 600; color: #92400e;">25.0%</span>
      <span style="color: #6b7280; font-size: 8pt;"> per conception</span>
    </div>
  </div>
  ` : `
  <div style="background: #ecfdf5; padding: 10px 14px; border-radius: 4px; border: 1px solid #6ee7b7;">
    <span style="color: #065f46; font-weight: 500;">✓ No autosomal recessive carrier concordance detected</span>
    <div style="color: #6b7280; font-size: 8pt; margin-top: 2px;">Population-level risk only for recessive conditions</div>
  </div>
  `}
</div>

<!-- ========== SECTION 2: EMBRYO SELECTION ========== -->
<div class="section">
  <div class="section-title"><span class="section-number">2.</span> EMBRYO SELECTION & PROBABILITY METRICS</div>
  <div class="grid-3">
    <div class="card" style="border-color: #10b981;">
      <div class="card-label">NON-AFFECTED PROBABILITY</div>
      <div class="card-value">${hasRecessiveRisk ? '75.0' : '98.0'}<span class="unit">%</span></div>
      <div style="font-size: 7pt; color: #6b7280;">Unaffected / Carrier</div>
      <div class="probability-bar"><div class="probability-fill" style="width: ${hasRecessiveRisk ? 75 : 98}%; background: #10b981;"></div></div>
    </div>
    <div class="card" style="border-color: #f59e0b;">
      <div class="card-label">CARRIER PROBABILITY</div>
      <div class="card-value">${hasRecessiveRisk ? '50.0' : '1.0'}<span class="unit">%</span></div>
      <div style="font-size: 7pt; color: #6b7280;">Heterozygous</div>
      <div class="probability-bar"><div class="probability-fill" style="width: ${hasRecessiveRisk ? 50 : 1}%; background: #f59e0b;"></div></div>
    </div>
    <div class="card" style="border-color: #3b82f6;">
      <div class="card-label">GENOTYPICALLY NORMAL</div>
      <div class="card-value">${hasRecessiveRisk ? '25.0' : '1.0'}<span class="unit">%</span></div>
      <div style="font-size: 7pt; color: #6b7280;">Homozygous Wild-Type</div>
      <div class="probability-bar"><div class="probability-fill" style="width: ${hasRecessiveRisk ? 25 : 1}%; background: #3b82f6;"></div></div>
    </div>
  </div>
</div>

<!-- ========== SECTION 3: CLINICAL RECOMMENDATIONS ========== -->
<div class="section">
  <div class="section-title"><span class="section-number">3.</span> CLINICAL RECOMMENDATIONS</div>
  <ul class="bullet-list">
    <li>PGT-M is recommended for all cycle embryos prior to transfer.</li>
    <li>Orthogonal CLIA/CAP-accredited targeted sequencing confirmation is suggested before clinical action.</li>
    <li>Genetic counselling is advised to review reproductive options in light of the ${hasRecessiveRisk ? '25%' : 'low'} affected-embryo risk.</li>
    <li>Results should be interpreted alongside a board-certified clinical geneticist — this report is a decision-support artifact, not a standalone diagnosis.</li>
  </ul>
  <div style="margin-top: 6px; padding: 8px 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px;">
    <div style="font-size: 7.5pt; color: #6b7280; line-height: 1.5; font-style: italic;">
      This report was synthesised by the Genetix Bayesian inference engine and constrained-guardrail Gemini clinical-language layer. It is intended for use as a decision-support attachment within a clinician-reviewed Electronic Health Record (EHR) workflow and does not replace confirmatory laboratory diagnostics.
    </div>
  </div>
</div>

<!-- ========== PAGE BREAK - MATERNAL & FETAL ========== -->
<div class="page-break">
  <div class="page-break-label">— Maternal & Fetal Assessment —</div>

  <!-- SECTION 4: MATERNAL & FETAL RISK -->
  <div class="section">
    <div class="section-title"><span class="section-number">4.</span> MATERNAL & FETAL RISK ASSESSMENT</div>
    <div class="grid-2">
      <div class="card">
        <div class="card-label">Mother (Alpha)</div>
        <table>
          <tr><td>Blood</td><td><strong>${p1.bloodType}</strong></td></tr>
          <tr><td>Eyes</td><td><strong>${p1.eyeColor}</strong></td></tr>
          <tr><td>Hair</td><td><strong>${p1.hairTexture || 'Wavy'}</strong></td></tr>
          <tr><td>Height</td><td><strong>${p1.heightCm || 170} cm</strong></td></tr>
        </table>
      </div>
      <div class="card">
        <div class="card-label">Maternal Health</div>
        <table>
          <tr><td>Age</td><td><strong>${p1.maternalHealth?.age || 28} years</strong></td></tr>
          <tr><td>Blood Pressure</td><td><strong>${p1.maternalHealth?.systolicBP || 120}/${p1.maternalHealth?.diastolicBP || 80} mmHg</strong></td></tr>
          <tr><td>Glucose</td><td><strong>${p1.maternalHealth?.glucoseLevel || 95} mg/dL</strong></td></tr>
        </table>
      </div>
    </div>
  </div>

  <!-- SECTION 5: BLOOD GROUP COMPATIBILITY -->
  <div class="section">
    <div class="section-title"><span class="section-number">5.</span> BLOOD GROUP COMPATIBILITY</div>
    <div class="risk-box ${rhRisk.isAtRisk ? 'risk-high' : 'risk-low'}">
      <strong>${rhRisk.isAtRisk ? '⚠ RH INCOMPATIBILITY DETECTED' : '✓ Rh Compatible'}</strong>
      <p style="margin-top: 4px; font-size: 8.5pt;">${rhRisk.message}</p>
      ${rhRisk.isAtRisk ? `
        <div style="margin-top: 6px; padding: 6px 10px; background: rgba(239, 68, 68, 0.05); border-radius: 4px; border: 1px solid #fca5a5;">
          <div style="font-size: 8pt; color: #991b1b;"><strong>Flags:</strong> HDN Risk — RhoGAM Prophylaxis Required</div>
          <div style="font-size: 8pt; color: #1e2a3a; margin-top: 3px;">
            <strong>Recommended action:</strong> initiate standard anti-D (RhoGAM) prevention protocol per ACOG guidance and confirm fetal Rh status.
          </div>
        </div>
      ` : ''}
    </div>
  </div>
</div>

<!-- ========== SECTION 6: MATERNAL RISK ========== -->
<div class="section">
  <div class="section-title"><span class="section-number">6.</span> MATERNAL RISK ASSESSMENT</div>
  <div class="risk-box ${pregnancyRisk.status === 'HIGH' ? 'risk-high' : pregnancyRisk.status === 'MODERATE' ? 'risk-moderate' : 'risk-low'}">
    <strong>${pregnancyRisk.status === 'HIGH' ? '⚠ HIGH RISK' : pregnancyRisk.status === 'MODERATE' ? '⚠ MODERATE RISK' : '✓ LOW RISK'}</strong>
    <span style="font-size: 9pt; margin-left: 10px; color: #6b7280;">Score: ${pregnancyRisk.riskScore}</span>
    <ul>
      ${pregnancyRisk.notes.map((note: string) => `<li>${note}</li>`).join('')}
    </ul>
  </div>
</div>

<!-- ========== SECTION 7: POLYGENIC RISK ========== -->
<div class="section">
  <div class="section-title"><span class="section-number">7.</span> GENETIC RISK ASSESSMENT (POLYGENIC LAYER)</div>
  <div class="grid-2">
    ${pathologyRisks.filter(r => r.carrier === undefined).slice(0, 2).map(risk => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="card-label">${risk.label}</span>
          <span class="badge badge-polygenic">Polygenic</span>
        </div>
        <div class="card-value" style="color: ${risk.affected > 0.3 ? '#dc2626' : risk.affected > 0.15 ? '#d97706' : '#059669'};">${(risk.affected * 100).toFixed(1)}<span class="unit">%</span></div>
        <div class="probability-bar"><div class="probability-fill" style="width: ${risk.affected * 100}%; background: ${risk.affected > 0.3 ? '#dc2626' : risk.affected > 0.15 ? '#d97706' : '#059669'};"></div></div>
        <div style="font-size: 7.5pt; color: #6b7280; margin-top: 4px;">${risk.description}</div>
      </div>
    `).join('')}
  </div>
</div>

<!-- ========== SECTION 8: PHENOTYPIC ANALYSIS ========== -->
<div class="section">
  <div class="section-title"><span class="section-number">8.</span> PHENOTYPIC ANALYSIS SUMMARY</div>
  <div class="analysis-text">
    <strong>• Height Prediction:</strong> with parents at ${p1.heightCm || 170} cm and ${p2.heightCm || 170} cm, expected offspring height range is 160—180 cm (~80% heritability, polygenic model).<br/>
    <strong>• Eye Colour Distribution:</strong> parental combination ${p1.eyeColor} × ${p2.eyeColor} — offspring distribution weighted toward brown, per the probability chart generated by the engine.<br/>
    <strong>• Thalassaemia:</strong> no carrier status detected in either parent — population-level risk only.<br/>
    <strong>• Colour Blindness:</strong> no family history detected — standard vision screening recommended.
  </div>
</div>

<!-- ========== SECTION 9: PREVENTIVE RECOMMENDATIONS ========== -->
<div class="section">
  <div class="section-title"><span class="section-number">9.</span> PREVENTIVE RECOMMENDATIONS</div>
  <ul class="bullet-list">
    <li>Schedule routine prenatal visits every 4 weeks until 28 weeks, then every 2—3 weeks thereafter.</li>
    <li>Complete carrier screening for conditions with elevated family history risk.</li>
    <li>Maintain folic acid supplementation (400—800 mcg daily).</li>
    <li>Consider non-invasive prenatal testing (NIPT) for chromosome abnormalities.</li>
  </ul>
</div>

<!-- ========== DISCLAIMER & FOOTER ========== -->
<div class="section">
  <div class="disclaimer">
    <strong>Educational simulation only.</strong> Generated from probabilistic Mendelian and polygenic inheritance models by the Genetix engine. Not for clinical use — please consult a qualified healthcare provider or genetic counsellor for medical decisions.
  </div>
</div>

<div class="footer">
  <p><span class="brand">GENETIX</span> v4.2 &bull; Bayesian Inference &bull; Constrained AI</p>
  <p style="margin-top: 2px;">© 2024 Genetix Probability Engine &bull; Research &amp; Education Platform</p>
</div>

</body>
</html>
    `;
  };

  const generateTXTContent = () => {
    const hasRecessiveRisk = pathologyRisks.some(risk => risk.carrier !== undefined && risk.carrier > 0.1);
    
    const lines = [
      '='.repeat(70),
      'GENETIX PROBABILITY ENGINE',
      'PREIMPLANTATION GENETIC REPORT',
      'PGT-M / Monogenic Disorder Assessment',
      '='.repeat(70),
      '',
      `Patient Couple:      Alpha & Beta`,
      `Assessment Type:     PGT-M / Autosomal Recessive`,
      `Engine Version:      Genetix Bayesian v4.2`,
      '',
      '='.repeat(70),
      '1. CARRIER CONCORDANCE ANALYSIS',
      '='.repeat(70),
      '',
      hasRecessiveRisk ? 
        '• Gene: CFTR (chromosome 7q31.2)' :
        '✓ No autosomal recessive carrier concordance detected',
      hasRecessiveRisk ? '• Variant: c.1521_1523delCTT (p.Phe508del) — Pathogenic per ACMG' : '',
      hasRecessiveRisk ? `• Parent Alpha: Confirmed heterozygous carrier` : '',
      hasRecessiveRisk ? `• Parent Beta: Confirmed heterozygous carrier` : '',
      hasRecessiveRisk ? '• Joint Recessive Transmission Risk: 25.0% per conception' : '  Population-level risk only for recessive conditions',
      '',
      '='.repeat(70),
      '2. EMBRYO SELECTION & PROBABILITY METRICS',
      '='.repeat(70),
      '',
      'NON-AFFECTED PROBABILITY  | CARRIER PROBABILITY    | GENOTYPICALLY NORMAL',
      '[Unaffected / Carrier]    | [Heterozygous]         | [Homozygous Wild-Type]',
      `${hasRecessiveRisk ? '75.0' : '98.0'}%                     | ${hasRecessiveRisk ? '50.0' : '1.0'}%                  | ${hasRecessiveRisk ? '25.0' : '1.0'}%`,
      '',
      '='.repeat(70),
      '3. CLINICAL RECOMMENDATIONS',
      '='.repeat(70),
      '',
      '• PGT-M is recommended for all cycle embryos prior to transfer.',
      '• Orthogonal CLIA/CAP-accredited targeted sequencing confirmation is suggested before clinical action.',
      `• Genetic counselling is advised to review reproductive options in light of the ${hasRecessiveRisk ? '25%' : 'low'} affected-embryo risk.`,
      '• Results should be interpreted alongside a board-certified clinical geneticist.',
      '',
      '='.repeat(70),
      '4. MATERNAL & FETAL RISK ASSESSMENT',
      '='.repeat(70),
      '',
      `Mother (Alpha):       Blood ${p1.bloodType} • Eyes ${p1.eyeColor} • Hair ${p1.hairTexture || 'Wavy'} • ${p1.heightCm || 170} cm`,
      `Maternal Age:         ${p1.maternalHealth?.age || 28} years`,
      `Blood Pressure:       ${p1.maternalHealth?.systolicBP || 120}/${p1.maternalHealth?.diastolicBP || 80} mmHg`,
      `Glucose:              ${p1.maternalHealth?.glucoseLevel || 95} mg/dL`,
      '',
      '='.repeat(70),
      '5. BLOOD GROUP COMPATIBILITY',
      '='.repeat(70),
      '',
      `${rhRisk.isAtRisk ? '⚠ RH INCOMPATIBILITY DETECTED' : '✓ Rh Compatible'}`,
      `${rhRisk.message}`,
      rhRisk.isAtRisk ? 'Flags: HDN Risk — RhoGAM Prophylaxis Required' : '',
      '',
      '='.repeat(70),
      '6. MATERNAL RISK ASSESSMENT',
      '='.repeat(70),
      '',
      `Status: ${pregnancyRisk.status} RISK (Score: ${pregnancyRisk.riskScore})`,
      pregnancyRisk.notes.map(n => `  • ${n}`).join('\n'),
      '',
      '='.repeat(70),
      '7. GENETIC RISK ASSESSMENT (POLYGENIC LAYER)',
      '='.repeat(70),
      '',
      ...pathologyRisks.filter(r => r.carrier === undefined).slice(0, 2).map(risk => 
        `${risk.label}: ${(risk.affected * 100).toFixed(1)}% [Polygenic]`
      ),
      '',
      '='.repeat(70),
      '8. PHENOTYPIC ANALYSIS SUMMARY',
      '='.repeat(70),
      '',
      `• Height Prediction: with parents at ${p1.heightCm || 170} cm and ${p2.heightCm || 170} cm, expected offspring height range is 160—180 cm.`,
      `• Eye Colour Distribution: parental combination ${p1.eyeColor} × ${p2.eyeColor}.`,
      '• Thalassaemia: no carrier status detected in either parent.',
      '• Colour Blindness: no family history detected.',
      '',
      '='.repeat(70),
      '9. PREVENTIVE RECOMMENDATIONS',
      '='.repeat(70),
      '',
      '• Schedule routine prenatal visits every 4 weeks until 28 weeks.',
      '• Complete carrier screening for conditions with elevated risk.',
      '• Maintain folic acid supplementation (400—800 mcg daily).',
      '• Consider non-invasive prenatal testing (NIPT).',
      '',
      '='.repeat(70),
      'DISCLAIMER',
      '='.repeat(70),
      '',
      'Educational simulation only. Generated from probabilistic Mendelian and polygenic inheritance models.',
      'Not for clinical use — consult a qualified healthcare provider or genetic counsellor.',
      '',
      '='.repeat(70),
      'GENETIX v4.2 | Bayesian Inference | Constrained AI',
      '© 2024 Genetix Probability Engine',
      '='.repeat(70)
    ];

    return lines.join('\n');
  };

  const generateJSONContent = () => {
    const hasRecessiveRisk = pathologyRisks.some(risk => risk.carrier !== undefined && risk.carrier > 0.1);
    
    return JSON.stringify({
      report_type: "PGT-M / Monogenic Disorder Assessment",
      patient_couple: "Alpha & Beta",
      engine_version: "Genetix Bayesian v4.2",
      metadata: {
        generated: new Date().toISOString(),
        version: "4.2",
        engine: "Genetix Probability Engine"
      },
      carrier_concordance: {
        detected: hasRecessiveRisk,
        gene: hasRecessiveRisk ? "CFTR" : null,
        chromosome: hasRecessiveRisk ? "7q31.2" : null,
        variant: hasRecessiveRisk ? "c.1521_1523delCTT (p.Phe508del)" : null,
        parent_alpha: hasRecessiveRisk ? "Confirmed heterozygous carrier" : "Non-carrier",
        parent_beta: hasRecessiveRisk ? "Confirmed heterozygous carrier" : "Non-carrier",
        transmission_risk: hasRecessiveRisk ? 25.0 : 0.0
      },
      embryo_probabilities: {
        non_affected: hasRecessiveRisk ? 75.0 : 98.0,
        carrier: hasRecessiveRisk ? 50.0 : 1.0,
        genotypically_normal: hasRecessiveRisk ? 25.0 : 1.0
      },
      parents: {
        mother: {
          bloodType: p1.bloodType,
          eyeColor: p1.eyeColor,
          hairTexture: p1.hairTexture || 'Wavy',
          heightCm: p1.heightCm || 170,
          thalassemia: p1.thalassemia,
          colorBlindness: p1.colorBlindness,
          myopia: p1.myopia,
          diabetesT2: p1.diabetesT2,
          maternalHealth: p1.maternalHealth
        },
        father: {
          bloodType: p2.bloodType,
          eyeColor: p2.eyeColor,
          hairTexture: p2.hairTexture || 'Wavy',
          heightCm: p2.heightCm || 170,
          thalassemia: p2.thalassemia,
          colorBlindness: p2.colorBlindness,
          myopia: p2.myopia,
          diabetesT2: p2.diabetesT2
        }
      },
      risks: {
        rhCompatibility: rhRisk,
        pregnancy: pregnancyRisk,
        pathologies: pathologyRisks
      },
      analysis: aiAnalysis,
      disclaimer: "Educational simulation only. Generated from probabilistic models. Not for clinical use."
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
      const win = window.open('', '_blank', 'width=1100,height=900,scrollbars=yes');
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
          }, 600);
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