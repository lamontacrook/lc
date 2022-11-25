import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * collapses all open nav sections
 * @param {Element} sections The container element
 */

function collapseAllNavSections(sections) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', 'false');
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch nav content
  const navPath = cfg.nav || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.innerHTML = html;
    decorateIcons(nav);

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((e, j) => {
      const section = nav.children[j];
      if (section) section.classList.add(`nav-${e}`);
    });

    const navSections = [...nav.children][1];
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          collapseAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        });
      });
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = '<div class="nav-hamburger-icon"></div>';
    hamburger.addEventListener('click', () => {
      const expanded = nav.getAttribute('aria-expanded') === 'true';
      document.body.style.overflowY = expanded ? '' : 'hidden';
      nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    nav.setAttribute('id', 'navbar');
    console.log(nav)
    decorateIcons(nav);
    block.append(nav);
  }
}


// let lastScrollTop = 0;

// window.onscroll = (e => {
//   let st = window.pageYOffset || document.documentElement.scrollTop;

//   if (st > lastScrollTop) {
//     console.log(`${st} up`);
//   } else {
//     document.getElementById("navbar").style.top = `${st+64}px`;
//     document.getElementById("navbar").style.opacity = "1";
//     console.log(`${st} down`);
//   }

//   lastScrollTop = st <= 0 ? 0 : st;

//   if (document.body.scrollTop > 32 || document.documentElement.scrollTop > 32)
//     document.getElementById("navbar").style.opacity = ".2";
//   else
//     document.getElementById("navbar").style.opacity = "1";

//   if (document.body.scrollTop > 64 || document.documentElement.scrollTop > 64) {
//     document.getElementById("navbar").style.top = '-64px';
//   } else {
//     document.getElementById("navbar").style.top = "0";
//   }
// })
