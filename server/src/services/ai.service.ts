export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatOptions {
  role: 'STUDENT' | 'FACULTY' | 'UNIVERSITY' | 'ADMIN';
  username: string;
  contextData?: Record<string, any>;
}

export class AIService {
  private static apiKey = process.env.GEMINI_API_KEY;

  private static getRoleSystemPrompt(role: string, username: string, context?: Record<string, any>): string {
    const baseSafety = `
IMPORTANT SECURITY & GOVERNANCE RULES:
- You are EDUNEXA's AI Assistant for the user '${username}', operating in the role of '${role}'.
- You CANNOT directly execute database mutations, approve institutions, modify course fees, or change user roles.
- Always provide clear, structured, professional, and educational responses using Markdown.
`;

    switch (role) {
      case 'STUDENT':
        return `${baseSafety}
ROLE: Student Academic & Learning Mentor
CAPABILITIES:
- Explain complex academic concepts (Mathematics, Engineering, Science, Management, Humanities, Computer Science).
- Generate practice quizzes, revision notes, flashcard summaries, and study plans.
- Provide step-by-step programming solutions with clean code and explanations.
- Clarify admission processes, eligibility criteria, and fee structure understanding for Indian universities.
- Maintain an encouraging, clear, and pedagocially sound tone.`;

      case 'FACULTY':
        return `${baseSafety}
ROLE: Faculty Pedagogical & Curriculum Assistant
CAPABILITIES:
- Draft structured lesson plans, lecture outlines, and syllabus modules.
- Create challenging assignment prompts, rubrics, and conceptual quiz questions.
- Formulate practical lab exercises and exam revision guides.
- Summarize academic papers, reference texts, and instructional materials.
- Note: Faculty must review and approve all AI-generated educational materials before distribution to students.`;

      case 'UNIVERSITY':
        return `${baseSafety}
ROLE: Institutional Management & Academic Administration Advisor
CAPABILITIES:
- Draft clear course catalogs, department overviews, and admission eligibility brochures.
- Create comprehensive admission FAQs, campus notices, and academic deadline announcements.
- Structure fee schedule explanations and scholarship documentation.
- Formulate institutional policy drafts and accreditation documentation outlines.
- Human review and authorized institutional sign-off is required for all official publications.`;

      case 'ADMIN':
        return `${baseSafety}
ROLE: Enterprise Platform Governance & Analytics Intelligence
CAPABILITIES:
- Summarize platform operational statistics, verification queues, and audit log trends.
- Suggest content moderation criteria and standard administrative notification templates.
- Identify data anomalies, unverified institution records, and system health considerations.
- REMINDER: You do NOT have autonomous execution authority. All suspensions, approvals, and fee updates require manual administrator confirmation.`;

      default:
        return `${baseSafety}\nProvide helpful educational and academic guidance.`;
    }
  }

  public static async generateResponse(
    messages: AIChatMessage[],
    options: AIChatOptions
  ): Promise<string> {
    const systemPrompt = this.getRoleSystemPrompt(options.role, options.username, options.contextData);
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        // Attempt call to Gemini REST API
        const formattedContents = messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              contents: formattedContents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (response.ok) {
          const data = (await response.json()) as any;
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return candidateText;
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, switching to EDUNEXA Academic Knowledge Engine fallback:', err);
      }
    }

    // High quality intelligent built-in academic fallback engine
    return this.generateAcademicFallback(messages[messages.length - 1]?.content || '', options);
  }

  private static generateAcademicFallback(query: string, options: AIChatOptions): string {
    const raw = query.trim();
    const q = raw.toLowerCase();
    const { role } = options;

    // Natural conversation greetings (Section 10 specification)
    if (q === 'hi' || q === 'hey' || q === 'hi there' || q === 'hai' || q === 'hy') {
      return 'Hi! How can I help you today?';
    }

    if (q === 'hello' || q === 'hello there') {
      return 'Hello! How can I assist you?';
    }

    if (q.includes('how are you')) {
      return 'I’m doing well, thank you! How can I help you with your studies or admission?';
    }

    if (q.includes('thank') || q.includes('thanks')) {
      return 'You’re very welcome! Let me know if you need any other assistance with universities, college admissions, or study notes.';
    }

    if (role === 'STUDENT') {
      if (q.includes('dsa') || q.includes('data structure') || q.includes('algorithm') || q.includes('tree') || q.includes('graph')) {
        return `### 📘 Data Structures & Algorithms Mastery Guide

Here is a structured breakdown to master this topic:

1. **Core Concept**:
   - Understand the time and space complexity ($O(1)$, $O(\\log n)$, $O(n)$, $O(n \\log n)$, $O(n^2)$).
   - In competitive exams and technical interviews, selecting the right data structure directly impacts memory and runtime.

2. **Key Operations & Invariants**:
   - **Search / Insertion / Deletion**: Compare Arrays vs Linked Lists vs Balanced Binary Search Trees (AVL / Red-Black) vs Hash Tables.
   - **Traversal**: BFS (Level Order using Queue) vs DFS (Preorder, Inorder, Postorder using Recursion / Stack).

3. **Practice Problem Recommendation**:
   - Check out the **Study Resources** section in NEXORA under Computer Science Semester 3/4.
   - Would you like a step-by-step code implementation in C++, Java, or Python?`;
      }

      if (q.includes('ktu') || q.includes('calicut') || q.includes('mgu') || q.includes('kerala university') || q.includes('cusat') || q.includes('kannur')) {
        return `### 🏛️ NEXORA Verified University Guide

NEXORA directly tracks verified affiliations, departments, and admissions across the 6 premier Kerala Universities:

1. **APJ Abdul Kalam Technological University (KTU)**: Apex technological university for engineering in Kerala, affiliated with premier institutions like CET, GEC Thrissur, TKM College of Engineering, RIT Kottayam, and MITS.
2. **University of Calicut**: North Kerala's largest state university, with top colleges like Farook College, St. Joseph's Devagiri, Govt Arts College Kozhikode, and Zamorin's Guruvayurappan College.
3. **Mahatma Gandhi University (MGU)**: Kottayam-based NAAC A++ university, affiliated with St. Teresa's College, CMS College, and Sacred Heart College Thevara.
4. **University of Kerala**: Thiruvananthapuram, featuring historic institutions like University College, Mar Ivanios College, and Govt Arts College.
5. **Cochin University of Science and Technology (CUSAT)**: Specialized science & tech hub with School of Engineering (SOE), CUCEK, and Marine Engineering.
6. **Kannur University**: Serving Malabar region with GCEK Kannur, Govt Brennen College Thalassery, Sir Syed College, and Nirmalagiri College.

Would you like to explore colleges or apply for a specific university? Head over to **Explore Universities** or click **Apply for Admission**!`;
      }

      if (q.includes('admission') || q.includes('college') || q.includes('fee') || q.includes('apply')) {
        return `### 🎓 NEXORA Admission & College Navigator

Here are key insights for your college exploration:

- **Centralized Admission Portal**: Complete the verified 7-step admission application in the **Apply for Admission** tab to receive an official application reference number (e.g. \`NEXORA-2026-XXXXXX\`).
- **Dynamic Selection Flow**: Select your target university, browse only its affiliated colleges, and see exact offered courses, semester structure, and eligibility.
- **Course Fee Transparency**: NEXORA tracks verified annual tuition, examination, and laboratory fees published in official government gazettes.
- **Next Steps**:
  1. Go to **Universities** or **Colleges** to compare options.
  2. Click **Apply for Admission** on any college card to start your application.
  3. Track your submitted applications in real time in the **Student Dashboard**!`;
      }

      if (q.includes('study plan') || q.includes('schedule') || q.includes('revision') || q.includes('exam') || q.includes('resource') || q.includes('notes')) {
        return `### 🗓️ Semester-Wise Academic Resources & Study Strategy

In NEXORA, study resources are structured through a clear hierarchy:
**University → College → Course → Semester → Subject → Resource Type**

Available resources include:
- 📄 **Official Syllabus & Regulations**
- 📚 **Comprehensive Lecture Notes**
- 📝 **Previous Year Question Papers & Answer Keys**
- 🎯 **Question Banks & Practical Record Manuals**

You can filter resources semester-by-semester in the **Study Resources** tab. Would you like assistance finding resources for a specific subject?`;
      }

      return `### 💡 NEXORA Academic & Admission Assistant

Hello **${options.username}**! I'm here to assist you with your academic and admission journey on NEXORA.

Here is what you can ask me:
- 🏛️ **Universities & Colleges**: Ask about KTU, Calicut, MG University, Kerala University, CUSAT, or Kannur University affiliations and categories.
- 📋 **Admission Guidance**: Learn about the 7-step admission process, eligibility criteria, and fee structures.
- 📖 **Concept Explanations**: Ask me to explain concepts in Computer Science, Mathematics, Physics, Chemistry, Economics, or Commerce.
- 📚 **Study Resources**: Find semester-wise notes, previous year question papers, and syllabus guides.

How can I help you today?`;
    }

    if (role === 'FACULTY') {
      if (q.includes('lesson plan') || q.includes('lecture') || q.includes('syllabus')) {
        return `### 📋 Comprehensive 60-Minute Lesson Plan Template

**Subject**: Academic Course Module  
**Target Level**: Undergraduate / Postgraduate  

1. **Learning Objectives (5 mins)**:
   - State specific, measurable Bloom's Taxonomy outcomes (Understand, Apply, Analyze).
2. **Prior Knowledge Activation (5 mins)**:
   - Quick recall question connecting today's topic to the previous lecture.
3. **Core Concept Exposition (25 mins)**:
   - Theoretical foundation, visual diagrams, and real-world case analysis.
4. **Active Learning Activity (15 mins)**:
   - Small group problem solving or live code walkthrough.
5. **Formative Assessment & Wrap-up (10 mins)**:
   - Exit ticket question and preview of upcoming assignment.

*Faculty Tip: You can upload this syllabus document to the EDUNEXA Study Resources section for your assigned course!*`;
      }

      return `### 🎓 Faculty Academic & Curriculum Assistant

Welcome, Professor **${options.username}**!

I can assist you with:
- 📑 **Lesson Planning & Syllabi**: Structuring course schedules and semester milestones.
- ✍️ **Question Bank Generation**: Drafting multiple-choice, short-answer, and analytical problem statements.
- 📊 **Rubric Design**: Creating transparent grading criteria for assignments and lab records.
- 📢 **Course Announcements**: Composing clear updates for student portals.

What educational task can I help you prepare today?`;
    }

    if (role === 'UNIVERSITY') {
      return `### 🏛️ University Institutional Management Assistant

Welcome **${options.username}** representative!

I can help streamline your institutional presence on EDUNEXA:
- 📢 **Admission Announcements**: Draft notifications for intake cycles, entrance tests, and eligibility criteria.
- 📜 **Course Catalog Descriptions**: Formulate comprehensive course profiles, seat matrices, and fee breakdowns.
- ❓ **Admission FAQs**: Generate clear candidate inquiry responses regarding hostels, scholarships, and verification documents.
- 📊 **Administrative Summaries**: Organize department metrics and course offerings for student visibility.

How can I assist your institution today?`;
    }

    // ADMIN
    return `### 🛡️ EDUNEXA Enterprise Administration Assistant

Administrator **${options.username}**, system operations overview:

- 🔍 **Governance**: Review pending institution verifications, course fee updates, and user status controls.
- 📋 **Audit Intelligence**: System records all administrative actions with actor IDs, target entities, and timestamps.
- ⚠️ **Policy Enforcement**: Automated flags identify unverified fee listings and moderation reports for human review.

*Note: All record updates, approvals, and suspensions require explicit authorization in the Admin Management Console.*

How can I assist your platform oversight today?`;
  }
}
