/**
 * FILE: src/content/schema.js
 * WHAT IT DOES
 *   The RULES for content files (what fields are required, allowed colours, icon names, sticker limits...).
 *   Used by the build check (scripts/validate-content.mjs) and by the admin, so both agree.
 *     validateContent(content, { iconNames, assetExists })  ->  list of problems (empty = all good)
 *   Plain JS with no imports so it runs in the browser and in Node.
 */
export const TONES = ['blue', 'yellow', 'pink', 'mint', 'lilac', 'peach', 'white', 'cream'];
// Where a live demo can be running. `label` is what visitors see on the badge.
export const DEMO_HOSTS = [
  { value: 'streamlit', label: 'Streamlit' },
  { value: 'huggingface', label: 'Hugging Face' },
  { value: 'aws', label: 'AWS' },
  { value: 'digitalocean', label: 'DigitalOcean' },
  { value: 'vercel', label: 'Vercel' },
  { value: 'netlify', label: 'Netlify' },
  { value: 'render', label: 'Render' },
  { value: 'github', label: 'GitHub Pages' },
  { value: 'other', label: 'Other' },
];
export const SECTION_IDS = ['profile', 'projects', 'resume', 'hobbies', 'writing', 'contact'];
const POS_KEYS = ['top', 'bottom', 'left', 'right'];
const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i;

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

export function validateContent(content, ctx = {}) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const iconNames = ctx.iconNames ?? new Set();
  const assetExists = ctx.assetExists;

  // ---- reusable checks -------------------------------------------------
  const str = (obj, key, where) => {
    if (!isStr(obj?.[key])) err(where, `"${key}" must be a non-empty string`);
  };
  const strOpt = (obj, key, where) => {
    if (obj?.[key] !== undefined && !isStr(obj[key])) err(where, `"${key}" must be a non-empty string when present`);
  };
  const strList = (arr, where, { min = 0 } = {}) => {
    if (!Array.isArray(arr)) return err(where, 'must be a list');
    if (arr.length < min) err(where, `needs at least ${min} item(s)`);
    arr.forEach((v, i) => {
      if (!isStr(v)) err(`${where}[${i}]`, 'must be a non-empty string');
    });
  };
  const tone = (obj, where) => {
    if (!TONES.includes(obj?.tone)) err(where, `"tone" must be one of: ${TONES.join(', ')}`);
  };
  const url = (obj, key, where) => {
    if (!isStr(obj?.[key]) || !/^(https?:\/\/|mailto:)/i.test(obj[key])) err(where, `"${key}" must start with http(s):// or mailto:`);
  };
  // a local file path ("assets/…") or an external link
  const file = (value, where, label) => {
    if (!isStr(value)) return err(where, `"${label}" must be a non-empty string`);
    if (!EXTERNAL.test(value) && assetExists && !assetExists(value)) err(where, `file not found in /public: ${value}`);
  };
  const uniqueIds = (arr, where) => {
    const seen = new Set();
    arr.forEach((item, i) => {
      if (!isStr(item?.id)) return err(`${where}[${i}]`, '"id" must be a non-empty string');
      if (seen.has(item.id)) err(`${where}[${i}]`, `duplicate id "${item.id}"`);
      seen.add(item.id);
    });
  };
  const list = (value, where) => {
    if (!Array.isArray(value)) {
      err(where, 'must be a list');
      return false;
    }
    return true;
  };

  // ---- custom icons (checked first: other files may use them) ----------
  const customNames = new Set();
  if (list(content.icons, 'icons.json')) {
    content.icons.forEach((ic, i) => {
      const w = `icons.json[${i}]`;
      if (!isStr(ic?.name) || !/^[a-z0-9-]+$/.test(ic.name)) err(w, '"name" must be lowercase letters, numbers and dashes');
      else if (iconNames.has(ic.name)) err(w, `"${ic.name}" clashes with a built-in icon`);
      else if (customNames.has(ic.name)) err(w, `duplicate icon "${ic.name}"`);
      else customNames.add(ic.name);
      file(ic?.file, w, 'file');
    });
  }
  const knownIcon = (name) => iconNames.has(name) || customNames.has(name);
  const icon = (name, where) => {
    if (!isStr(name) || !knownIcon(name)) err(where, `unknown icon "${name}"`);
  };

  // ---- profile ---------------------------------------------------------
  const p = content.profile;
  if (!isObj(p)) err('profile.json', 'must be an object');
  else {
    ['name', 'role', 'lead', 'location', 'school', 'status'].forEach((k) => str(p, k, 'profile.json'));
    if (!isStr(p.email) || !p.email.includes('@')) err('profile.json', '"email" must look like an email address');
    file(p.avatar, 'profile.json', 'avatar');
    if (!isObj(p.resume)) err('profile.json', '"resume" must be an object');
    else {
      file(p.resume.path, 'profile.json resume', 'path');
      str(p.resume, 'filename', 'profile.json resume');
    }
    if (!isObj(p.links)) err('profile.json', '"links" must be an object');
    else ['linkedin', 'github', 'kaggle', 'medium', 'form'].forEach((k) => url(p.links, k, 'profile.json links'));
    ['current', 'startup'].forEach((k) => {
      if (!isObj(p[k])) err('profile.json', `"${k}" must be an object`);
      else {
        str(p[k], 'title', `profile.json ${k}`);
        str(p[k], 'text', `profile.json ${k}`);
      }
    });
    strList(p.focus, 'profile.json focus', { min: 1 });
    strList(p.toolkit, 'profile.json toolkit', { min: 1 });
    if (!isObj(p.certificate)) err('profile.json', '"certificate" must be an object');
    else {
      str(p.certificate, 'title', 'profile.json certificate');
      url(p.certificate, 'url', 'profile.json certificate');
    }
  }

  // ---- projects --------------------------------------------------------
  if (list(content.projects, 'projects.json')) {
    uniqueIds(content.projects, 'projects.json');
    content.projects.forEach((x, i) => {
      const w = `projects.json[${i}]`;
      ['title', 'category', 'tech'].forEach((k) => str(x, k, w));
      tone(x, w);
      file(x?.href, w, 'href');
      if (x?.image !== undefined) file(x.image, w, 'image');

      // Optional: a project can be a live demo hosted somewhere else.
      if (x?.kind !== undefined && !['project', 'demo'].includes(x.kind)) err(w, '"kind" must be "project" or "demo"');
      if (x?.kind === 'demo') {
        if (!isObj(x.demo)) return err(w, 'a demo needs a "demo" section');
        url(x.demo, 'url', `${w}.demo`);
        if (x.demo.repoUrl !== undefined) url(x.demo, 'repoUrl', `${w}.demo`);
        if (!DEMO_HOSTS.some((h) => h.value === x.demo.host)) err(`${w}.demo`, `"host" must be one of: ${DEMO_HOSTS.map((h) => h.value).join(', ')}`);
        if (x.demo.embed !== undefined && typeof x.demo.embed !== 'boolean') err(`${w}.demo`, '"embed" must be true or false');
        strOpt(x.demo, 'note', `${w}.demo`);
      }
    });
  }

  // ---- hobbies ---------------------------------------------------------
  if (list(content.hobbies, 'hobbies.json')) {
    uniqueIds(content.hobbies, 'hobbies.json');
    content.hobbies.forEach((h, i) => {
      const w = `hobbies.json[${i}]`;
      str(h, 'title', w);
      str(h, 'text', w);
      tone(h, w);
      if (!Array.isArray(h?.icons) || h.icons.length < 1) err(w, '"icons" needs at least one icon');
      else h.icons.forEach((n, j) => icon(n, `${w}.icons[${j}]`));
    });
  }

  // ---- resume ----------------------------------------------------------
  const r = content.resume;
  if (!isObj(r)) err('resume.json', 'must be an object');
  else {
    if (list(r.experience, 'resume.json experience')) {
      uniqueIds(r.experience, 'resume.json experience');
      r.experience.forEach((x, i) => {
        const w = `resume.json experience[${i}]`;
        ['role', 'company', 'place', 'period'].forEach((k) => str(x, k, w));
        tone(x, w);
        strList(x?.bullets, `${w}.bullets`, { min: 1 });
        if (x?.wide !== undefined && typeof x.wide !== 'boolean') err(w, '"wide" must be true or false');
      });
    }
    if (list(r.education, 'resume.json education')) {
      uniqueIds(r.education, 'resume.json education');
      r.education.forEach((x, i) => {
        const w = `resume.json education[${i}]`;
        ['school', 'period', 'detail'].forEach((k) => str(x, k, w));
        tone(x, w);
      });
    }
    strList(r.certifications, 'resume.json certifications');
    strList(r.skills, 'resume.json skills');
  }

  // ---- writing ---------------------------------------------------------
  const wr = content.writing;
  if (!isObj(wr)) err('writing.json', 'must be an object');
  else {
    if (list(wr.articles, 'writing.json articles')) {
      uniqueIds(wr.articles, 'writing.json articles');
      wr.articles.forEach((a, i) => {
        const w = `writing.json articles[${i}]`;
        ['title', 'category', 'date', 'summary'].forEach((k) => str(a, k, w));
        tone(a, w);
        file(a?.image, w, 'image');
        file(a?.href, w, 'href');
      });
    }
    if (list(wr.links, 'writing.json links')) {
      uniqueIds(wr.links, 'writing.json links');
      wr.links.forEach((l, i) => {
        const w = `writing.json links[${i}]`;
        ['label', 'title'].forEach((k) => str(l, k, w));
        tone(l, w);
        file(l?.href, w, 'href');
      });
    }
  }

  // ---- stickers --------------------------------------------------------
  const st = content.stickers;
  if (!isObj(st)) err('stickers.json', 'must be an object keyed by section id');
  else {
    Object.keys(st).forEach((id) => {
      if (!SECTION_IDS.includes(id)) err('stickers.json', `unknown section "${id}"`);
    });
    SECTION_IDS.forEach((id) => {
      if (!Array.isArray(st[id])) return err('stickers.json', `"${id}" must be a list (use [] for none)`);
      st[id].forEach((s, i) => {
        const w = `stickers.json ${id}[${i}]`;
        icon(s?.icon, w);
        if (!isNum(s?.size) || s.size < 16 || s.size > 160) err(w, '"size" must be a number between 16 and 160');
        if (!isNum(s?.rot) || s.rot < -180 || s.rot > 180) err(w, '"rot" must be a number between -180 and 180');
        if (!isObj(s?.pos) || Object.keys(s.pos).length === 0) err(w, '"pos" needs at least one of top/bottom/left/right');
        else {
          Object.entries(s.pos).forEach(([k, v]) => {
            if (!POS_KEYS.includes(k)) err(w, `"pos.${k}" is not allowed (use top/bottom/left/right)`);
            else if (!isNum(v) && !(typeof v === 'string' && /^-?\d+(\.\d+)?%$/.test(v))) err(w, `"pos.${k}" must be a number (px) or a percentage like "20%"`);
          });
        }
        if (s?.keep !== undefined && typeof s.keep !== 'boolean') err(w, '"keep" must be true or false');
        if (s?.delay !== undefined && !isNum(s.delay)) err(w, '"delay" must be a number');
      });
    });
  }

  return errors;
}
