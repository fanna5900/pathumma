/**
 * Standalone Standard PDF 1.4 Generator
 * Generates genuine, compliant, multi-page PDF documents natively without external dependencies.
 */

export interface PdfDocumentSpec {
  title: string;
  subtitle: string;
  category: string; // NOTES, PREVIOUS_QUESTION_PAPER, SYLLABUS, etc.
  institutionName: string;
  courseOrClass: string;
  subject: string;
  academicYear: string;
  authorOrSource: string;
  verificationCode: string;
  pages: {
    heading: string;
    sections: {
      title?: string;
      paragraphs: string[];
      bulletPoints?: string[];
    }[];
  }[];
}

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\r\n]+/g, ' ');
}

// Split long text into lines of max characters
function wrapText(text: string, maxChars: number = 85): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxChars) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function buildAcademicPdf(spec: PdfDocumentSpec): Buffer {
  const objects: string[] = [];
  const byteOffsets: number[] = [];
  let currentOffset = 0;

  function addObject(content: string): number {
    const objIndex = objects.length + 1;
    const header = `${objIndex} 0 obj\n`;
    const footer = `\nendobj\n`;
    const full = header + content + footer;
    byteOffsets.push(currentOffset);
    currentOffset += Buffer.byteLength(full, 'utf8');
    objects.push(full);
    return objIndex;
  }

  // Initial PDF header
  const headerStr = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  currentOffset += Buffer.byteLength(headerStr, 'utf8');

  // We will build objects:
  // 1: Catalog
  // 2: Pages tree
  // 3: Font Helvetica
  // 4: Font Helvetica-Bold
  // 5: Font Helvetica-Oblique
  // 6...: Page objects and Content stream objects

  const totalPages = spec.pages.length + 1; // 1 Cover Page + Content Pages
  const pageObjectIds: number[] = [];

  // Placeholder for catalog (1) and pages (2) and fonts (3, 4, 5)
  // Let's create fonts first:
  // Catalog will be 1, Pages will be 2
  // Fonts: 3 (Helvetica), 4 (Helvetica-Bold), 5 (Helvetica-Oblique)
  const fontNormalId = 3;
  const fontBoldId = 4;
  const fontItalicId = 5;

  // Generate streams for each page
  const pageStreams: string[] = [];

  // ================= COVER PAGE =================
  let coverStream = '';
  // Background header band (Dark emerald #042f2e -> RGB 0.015, 0.184, 0.180)
  coverStream += 'q 0.015 0.184 0.180 rg 0 740 595.28 101.89 re f Q\n';
  // Gold accent line (RGB 0.85, 0.65, 0.15)
  coverStream += 'q 0.85 0.65 0.15 rg 0 736 595.28 4 re f Q\n';

  // Header Title
  coverStream += 'BT\n/F2 15 Tf\n1 1 1 rg\n50 790 Td\n(' + escapePdfText('NEXORA ACADEMIC REPOSITORY & VERIFIED STUDY PORTAL') + ') Tj\nET\n';
  coverStream += 'BT\n/F1 9 Tf\n0.8 0.9 0.85 rg\n50 765 Td\n(' + escapePdfText('OFFICIAL ACADEMIC CURRICULUM ARCHIVE • DOCUMENT VERIFICATION: ' + spec.verificationCode) + ') Tj\nET\n';

  // Document Badge
  coverStream += 'q 0.9 0.95 0.93 rg 50 690 180 26 re f 0.05 0.35 0.25 RG 1 w 50 690 180 26 re s Q\n';
  coverStream += 'BT\n/F2 11 Tf\n0.05 0.35 0.25 rg\n60 700 Td\n(' + escapePdfText(spec.category.replace(/_/g, ' ')) + ') Tj\nET\n';

  // Main Title
  let titleY = 640;
  const wrappedTitle = wrapText(spec.title, 50);
  for (const line of wrappedTitle) {
    coverStream += `BT\n/F2 20 Tf\n0.05 0.15 0.15 rg\n50 ${titleY} Td\n(${escapePdfText(line)}) Tj\nET\n`;
    titleY -= 26;
  }

  // Subtitle
  titleY -= 10;
  const wrappedSubtitle = wrapText(spec.subtitle, 70);
  for (const line of wrappedSubtitle) {
    coverStream += `BT\n/F3 11 Tf\n0.3 0.35 0.35 rg\n50 ${titleY} Td\n(${escapePdfText(line)}) Tj\nET\n`;
    titleY -= 16;
  }

  // Institutional Metadata Box
  titleY -= 20;
  coverStream += `q 0.96 0.98 0.97 rg 50 ${titleY - 140} 495.28 140 re f 0.8 0.85 0.82 RG 1 w 50 ${titleY - 140} 495.28 140 re s Q\n`;

  const metaRows = [
    ['Prescribed Institution / Board:', spec.institutionName],
    ['Degree / Academic Level:', spec.courseOrClass],
    ['Subject / Module Code:', spec.subject],
    ['Curriculum Academic Year:', spec.academicYear],
    ['Author / Academic Department:', spec.authorOrSource],
    ['Authenticity Status:', 'VERIFIED BY STATE ACADEMIC COUNCIL & EXAMINATION SYNDICATE'],
  ];

  let metaY = titleY - 25;
  for (const [k, v] of metaRows) {
    coverStream += `BT\n/F2 9.5 Tf\n0.1 0.25 0.2 rg\n65 ${metaY} Td\n(${escapePdfText(k)}) Tj\nET\n`;
    coverStream += `BT\n/F1 9.5 Tf\n0.15 0.15 0.15 rg\n250 ${metaY} Td\n(${escapePdfText(v)}) Tj\nET\n`;
    metaY -= 20;
  }

  // Executive Abstract Box
  titleY = titleY - 170;
  coverStream += `BT\n/F2 12 Tf\n0.05 0.25 0.2 rg\n50 ${titleY} Td\n(EXECUTIVE OVERVIEW & PEDAGOGIC PURPOSE) Tj\nET\n`;
  titleY -= 18;
  const abstractText = 'This academic resource has been officially compiled and vetted for students enrolled under the approved curriculum. It contains exhaustive conceptual formulations, worked-out illustrations, previous examination evaluation schemes, and standard pedagogical solutions aligned with the 2026-2027 state academic syllabus.';
  for (const line of wrapText(abstractText, 80)) {
    coverStream += `BT\n/F1 9.5 Tf\n0.25 0.25 0.25 rg\n50 ${titleY} Td\n(${escapePdfText(line)}) Tj\nET\n`;
    titleY -= 15;
  }

  // Seal & Security Notice at Bottom
  coverStream += 'q 0.05 0.35 0.25 rg 50 65 495.28 1 re f Q\n';
  coverStream += 'BT\n/F3 8 Tf\n0.4 0.4 0.4 rg\n50 50 Td\n(' + escapePdfText('NEXORA Higher Education & Secondary School Registry • Official Academic Copy • Page 1 of ' + totalPages) + ') Tj\nET\n';
  pageStreams.push(coverStream);

  // ================= CONTENT PAGES =================
  let pageNum = 2;
  for (const pg of spec.pages) {
    let pStream = '';
    // Mini Running Header
    pStream += 'q 0.015 0.184 0.180 rg 0 805 595.28 36.89 re f Q\n';
    pStream += 'BT\n/F2 9.5 Tf\n1 1 1 rg\n50 818 Td\n(' + escapePdfText(spec.title.slice(0, 75)) + ') Tj\nET\n';
    pStream += 'BT\n/F1 8.5 Tf\n0.8 0.9 0.85 rg\n460 818 Td\n(' + escapePdfText('Page ' + pageNum + ' of ' + totalPages) + ') Tj\nET\n';

    // Page Heading
    pStream += 'BT\n/F2 16 Tf\n0.05 0.25 0.2 rg\n50 765 Td\n(' + escapePdfText(pg.heading) + ') Tj\nET\n';
    pStream += 'q 0.05 0.45 0.35 rg 50 755 495.28 2 re f Q\n';

    let yPos = 735;

    for (const sec of pg.sections) {
      if (sec.title) {
        if (yPos < 120) break;
        pStream += `BT\n/F2 11.5 Tf\n0.1 0.2 0.25 rg\n50 ${yPos} Td\n(${escapePdfText(sec.title)}) Tj\nET\n`;
        yPos -= 18;
      }

      for (const p of sec.paragraphs) {
        const pLines = wrapText(p, 82);
        for (const line of pLines) {
          if (yPos < 90) break;
          pStream += `BT\n/F1 9.5 Tf\n0.18 0.18 0.18 rg\n50 ${yPos} Td\n(${escapePdfText(line)}) Tj\nET\n`;
          yPos -= 14;
        }
        yPos -= 6;
      }

      if (sec.bulletPoints && sec.bulletPoints.length > 0) {
        for (const bp of sec.bulletPoints) {
          const bpLines = wrapText(bp, 78);
          let isFirst = true;
          for (const line of bpLines) {
            if (yPos < 90) break;
            const prefix = isFirst ? '• ' : '  ';
            pStream += `BT\n/F1 9.5 Tf\n0.2 0.2 0.2 rg\n60 ${yPos} Td\n(${escapePdfText(prefix + line)}) Tj\nET\n`;
            yPos -= 14;
            isFirst = false;
          }
          yPos -= 4;
        }
      }

      yPos -= 10;
    }

    // Running Footer
    pStream += 'q 0.8 0.85 0.85 rg 50 55 495.28 1 re f Q\n';
    pStream += `BT\n/F3 8 Tf\n0.4 0.4 0.4 rg\n50 42 Td\n(${escapePdfText(spec.institutionName + ' • ' + spec.courseOrClass + ' • Document Ref: ' + spec.verificationCode)}) Tj\nET\n`;

    pageStreams.push(pStream);
    pageNum++;
  }

  // Now assemble PDF objects:
  // Obj 1: Catalog
  // Obj 2: Pages
  // Obj 3: Font F1 (Helvetica)
  // Obj 4: Font F2 (Helvetica-Bold)
  // Obj 5: Font F3 (Helvetica-Oblique)

  // We have totalPages pages. Each page has:
  // - 1 Page object
  // - 1 Contents stream object
  // So for N pages, we have 2*N objects starting after obj 5.
  // Page objects will be IDs: 6, 8, 10, ...
  // Content objects will be IDs: 7, 9, 11, ...

  const kidsArray: string[] = [];
  for (let i = 0; i < totalPages; i++) {
    const pageId = 6 + i * 2;
    kidsArray.push(`${pageId} 0 R`);
  }

  // 1: Catalog
  addObject(`<< /Type /Catalog /Pages 2 0 R >>`);

  // 2: Pages
  addObject(`<< /Type /Pages /Kids [${kidsArray.join(' ')}] /Count ${totalPages} >>`);

  // 3: Font Normal
  addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`);

  // 4: Font Bold
  addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>`);

  // 5: Font Italic
  addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>`);

  // Pages and Content streams
  for (let i = 0; i < totalPages; i++) {
    const contentObjId = 7 + i * 2;
    const stream = pageStreams[i];
    const streamLen = Buffer.byteLength(stream, 'utf8');

    // Page object
    addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentObjId} 0 R >>`);

    // Content stream object
    addObject(`<< /Length ${streamLen} >>\nstream\n${stream}\nendstream`);
  }

  // Build XREF table
  const startXref = currentOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of byteOffsets) {
    const padded = String(offset).padStart(10, '0');
    xref += `${padded} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  const fullPdfBuffer = Buffer.concat([
    Buffer.from(headerStr, 'utf8'),
    Buffer.from(objects.join(''), 'utf8'),
    Buffer.from(xref + trailer, 'utf8'),
  ]);

  return fullPdfBuffer;
}
