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