Here are **three standard VCF (Variant Call Format v4.2) test files** formatted as plain text. You can copy-paste these directly into plain text files saved with a `.vcf` extension (e.g., `mother_carrier.vcf`, `father_carrier.vcf`, `benign_sample.vcf`) to test your new **Genetic Data Importer** component.

---

### Test Case 1: Mother Carrier (Pathogenic *CFTR* Variant)

**FileName:** `mother_carrier.vcf`

**Contains:** Pathogenic Cystic Fibrosis deltaF508 mutation (`rs113993960`) in heterozygous state (`0/1`).

```text
##fileformat=VCFv4.2
##fileDate=20260815
##source=GenetixTestEngine
##reference=GRCh38
##INFO=<ID=RS,Number=1,Type=String,Description="dbSNP ID">
##INFO=<ID=CLNSIG,Number=.,Type=String,Description="ClinVar Clinical Significance">
##INFO=<ID=GENE,Number=1,Type=String,Description="Gene Symbol">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
chr7	117559590	rs113993960	CTTT	C	.	PASS	RS=113993960;GENE=CFTR;CLNSIG=Pathogenic	GT	0/1
chr13	32316461	rs80357065	A	G	.	PASS	RS=80357065;GENE=BRCA2;CLNSIG=Benign	GT	0/0

```

---

### Test Case 2: Father Carrier (Pathogenic *CFTR* Variant - Concordant Match)

**FileName:** `father_carrier.vcf`

**Contains:** Same pathogenic Cystic Fibrosis mutation (`rs113993960`) in heterozygous state (`0/1`), along with a Sickle Cell (*HBB*) variant (`rs334`). Use this alongside `mother_carrier.vcf` to trigger **Carrier Concordance** alerts in your PGT Simulator.

```text
##fileformat=VCFv4.2
##fileDate=20260815
##source=GenetixTestEngine
##reference=GRCh38
##INFO=<ID=RS,Number=1,Type=String,Description="dbSNP ID">
##INFO=<ID=CLNSIG,Number=.,Type=String,Description="ClinVar Clinical Significance">
##INFO=<ID=GENE,Number=1,Type=String,Description="Gene Symbol">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
chr7	117559590	rs113993960	CTTT	C	.	PASS	RS=113993960;GENE=CFTR;CLNSIG=Pathogenic	GT	0/1
chr11	5227002	rs334	T	A	.	PASS	RS=334;GENE=HBB;CLNSIG=Pathogenic	GT	0/1

```

---

### Test Case 3: Benign Control (No High-Risk Pathogenic Mutations)

**FileName:** `control_benign.vcf`

**Contains:** Only wild-type or benign variants. Use this to verify that your importer clears or sets risk status back to normal/low risk.

```text
##fileformat=VCFv4.2
##fileDate=20260815
##source=GenetixTestEngine
##reference=GRCh38
##INFO=<ID=RS,Number=1,Type=String,Description="dbSNP ID">
##INFO=<ID=CLNSIG,Number=.,Type=String,Description="ClinVar Clinical Significance">
##INFO=<ID=GENE,Number=1,Type=String,Description="Gene Symbol">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE
chr7	117559590	rs113993960	CTTT	C	.	PASS	RS=113993960;GENE=CFTR;CLNSIG=Benign	GT	0/0
chr11	5227002	rs334	T	A	.	PASS	RS=334;GENE=HBB;CLNSIG=Benign	GT	0/0

```

---

### Bonus: 23andMe / AncestryDNA Raw `.txt` Test Format

If your file drop handler also accepts raw 23andMe / Ancestry text exports, here is a snippet you can save as `23andme_sample.txt`:

```text
# 23andMe Data Export (Test Mock)
# rsid	chromosome	position	genotype
rs113993960	7	117559590	DI
rs334	11	5227002	TA
rs80357065	13	32316461	AA

```
---

### 500 Genomic Data

Here is your file: 
This file provides a structured, synthetic multi-sample VCF containing 500 individual samples mapped against genetic variants strongly tied to Type 2/monogenic diabetes risks and hereditary cancer syndromes. [1] 
## Cohort Overview & Risk Breakdown

| Genetic Risk Category | Targeted Variant | Gene | Clinical Context | Carrier Frequency in File |
|---|---|---|---|---|
| Hereditary Cancer Risk | rs80357372, rs80358974 | BRCA1, BRCA2 | Increased risk for breast and ovarian cancers. | Rare (~1–3% of cohort) |
| Lynch Syndrome | rs63751298, rs267608055 | MSH2, MLH1 | Elevated risk for colorectal and endometrial cancers. | Rare (~1–3% of cohort) |
| Monogenic Diabetes | rs1799884 | GCK | Maturity-Onset Diabetes of the Young (MODY). | Rare (~2% of cohort) |
| Polygenic Diabetes Risk | rs7903146, rs13266634, rs12255372 | TCF7L2, SLC30A8 | Common metabolic risk alleles for Type 2 Diabetes. | Common (~40–50% of cohort) |

## Structure of the Generated File

* Metadata Block: Standard VCF headers explicitly detailing the reference genome (GRCh38) and custom INFO fields defining associated genes and medical conditions.
* Genotype Mapping:
* 0/0: Normal homozygous (non-carrier/wild-type base).
   * 0/1: Heterozygous variant carrier (one abnormal risk allele).
   * 1/1: Homozygous alternate carrier (two copies of the risk allele). [2, 3] 

Disclaimer: This is a synthetic dataset generated for engineering pipeline testing, tool benchmarking, and validation purposes only. It does not contain real human medical or patient genotype records.
If you want to manipulate this dataset, I can write a Python script using pysam or pandas to parse out just the cancer carriers or calculate a diabetes genetic risk score (GRS). Which option would help you most?

[1] [https://www.ncbi.nlm.nih.gov](https://www.ncbi.nlm.nih.gov/books/NBK597726/)
[2] [https://obgyn.onlinelibrary.wiley.com](https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.12937)
[3] [https://pmc.ncbi.nlm.nih.gov](https://pmc.ncbi.nlm.nih.gov/articles/PMC3840048/)


---

### Other Websites To Get .VCF data

https://gnomad.broadinstitute.org/downloads
https://bochet.gcc.biostat.washington.edu/beagle/1000_Genomes_phase3_v5a/