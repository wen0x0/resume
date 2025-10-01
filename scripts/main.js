// Simple, configuration-driven resume renderer
async function loadResume() {
  try {
    const res = await fetch('./data/resume.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load resume.json');
    const resumeData = await res.json();
    renderResume(resumeData);
  } catch (err) {
    console.error(err);
    document.body.innerHTML = '<div style="max-width:800px;margin:2rem auto;font-family:system-ui,sans-serif"><h1>Failed to load resume</h1><p>Please ensure <code>data/resume.json</code> exists and is valid JSON.</p><pre>'+String(err)+'</pre></div>';
  }
}

function renderResume(data) {
  // Personal Info
  document.getElementById('fullName').textContent = data.personalInfo.name;
  document.getElementById('address').textContent = data.personalInfo.address;
  document.getElementById('phone').textContent = data.personalInfo.phone;
  const emailEl = document.getElementById('email');
  emailEl.textContent = data.personalInfo.email;
  emailEl.href = `mailto:${data.personalInfo.email}`;
  const liEl = document.getElementById('linkedin');
  liEl.textContent = data.personalInfo.linkedin;
  liEl.href = data.personalInfo.linkedinUrl;
  const aboutEl = document.getElementById('about');
  aboutEl.textContent = data.personalInfo.about || '';

  // Education
  const eduContainer = document.getElementById('educationEntries');
  eduContainer.innerHTML = (data.education||[]).map(edu => `
    <div class="entry">
      <div class="entry-header">
        <div class="entry-title">${escapeHTML(edu.degree)}</div>
        <div class="entry-date">${escapeHTML(edu.date)}</div>
      </div>
      <div class="entry-subtitle">${escapeHTML(edu.school)}</div>
      <div class="entry-description">
        <ul>
          ${(edu.details||[]).map(d=>`<li>${escapeHTML(d)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // Experience
  const expContainer = document.getElementById('experienceEntries');
  expContainer.innerHTML = (data.experience||[]).map(exp => `
    <div class="entry">
      <div class="entry-header">
        <div class="entry-title">${escapeHTML(exp.title)}</div>
        <div class="entry-date">${escapeHTML(exp.date)}</div>
      </div>
      <div class="entry-subtitle">${escapeHTML(exp.company)}, ${escapeHTML(exp.location)}</div>
      <div class="entry-description">
        <ul>
          ${(exp.responsibilities||[]).map(r=>`<li>${escapeHTML(r)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // Skills
  const skillsContainer = document.getElementById('skillsGrid');
  skillsContainer.innerHTML = (data.skills||[]).map(s=>`
    <div class="skill-category">
      <strong>${escapeHTML(s.category)}:</strong> ${escapeHTML(s.items)}
    </div>
  `).join('');

  // Projects
  const projContainer = document.getElementById('projectEntries');
  projContainer.innerHTML = (data.projects||[]).map(p=>`
    <div class="entry">
      <div class="entry-header">
        <div class="entry-title">${escapeHTML(p.title)}</div>
        <div class="entry-date">${escapeHTML(p.date)}</div>
      </div>
      <div class="entry-description">${escapeHTML(p.description)}</div>
    </div>
  `).join('');
}

function escapeHTML(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}

document.addEventListener('DOMContentLoaded', loadResume);
