import { Component, ElementRef, ViewChild } from '@angular/core';
import spells from '../assets/json/spells.json';
import { EnumArrayItem, convertEnumToArray } from './helper-functions/convertEnumToArray';
import { SchoolEnum } from './domain/enums/School.enum';
import { Spell } from './domain/Spell';
import { ClassEnum } from './domain/enums/Class.enum';
import { ClericDomainEnum } from './domain/enums/ClericDomain.enum';
import { DruidCircleEnum } from './domain/enums/DruidCircle.enum';
import { PaladinOathEnum } from './domain/enums/PaladinOath.enum';
import { WarlockPatronEnum } from './domain/enums/WarlockPatron.enum';
import { sortNumerically } from './helper-functions/sortNumerically';
import { sortAlphabetically } from './helper-functions/sortAlphabetically';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfGeneratorService } from './pdf-generator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private allSpells: Spell[] = spells as Spell[];
  spells: Spell[];
  selectedSpells: Spell[] = [];
  generated: boolean = false;

  schools: EnumArrayItem[] = convertEnumToArray(SchoolEnum);
  classes: EnumArrayItem[] = convertEnumToArray(ClassEnum);
  levels = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

  // clericDomain: EnumArrayItem[] = convertEnumToArray(ClericDomainEnum);
  // druidCircle: EnumArrayItem[] = convertEnumToArray(DruidCircleEnum);
  // paladinOath: EnumArrayItem[] = convertEnumToArray(PaladinOathEnum);
  // warlockPatron: EnumArrayItem[] = convertEnumToArray(WarlockPatronEnum);

  @ViewChild('printDiv') printDiv: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private pdfGenerator: PdfGeneratorService,
  ) {

  }
  
  ngOnInit(): void {
    this.allSpells.forEach(spell => {
      //splitting time
      // if (spell.desc.length > 1000) {
      //   let desc1: string = spell.desc.substring(0, 1000);
        
      // }
      // if (spell.higher_level)
      //   spell.desc += spell.higher_level;
      
      // spell.desc = spell.desc.replace(/([1-9]+d(4|6|8|10|12|20|100)\s[\S]*\sdamage)/g, '<span style="opacity: 0.9; font-weight: bold;">$1</span>' );
      // spell.desc = spell.desc.replace(/([1-9]+d(4|6|8|10|12|20|100))/g, '<span style="opacity: 0.9; font-weight: bold;">$1</span>');

      // if (spell.higher_level) {
      //   spell.higher_level = spell.higher_level.replace(/([1-9]+d(4|6|8|10|12|20|100))/g, '<span style="opacity: 0.9; font-weight: bold;">$1</span>' );
      //   spell['@higherLevelHtml'] = this.sanitizer.bypassSecurityTrustHtml(spell.higher_level);
      // }
      let desc1: string = '';
      let desc2: string = '';

      // if (spell.desc.length > 3200) {
      //   spell['@fontSize'] = '8pt';

      //   console.warn('TOO FUCKING LONG', spell.name)
      //   spell['@selected'] = true;

      //   let paragraphs: string[] = spell.desc.split(/(?=<p>|<li>)/g);
      //   paragraphs.forEach(p => {
      //     if (desc1.length + p.length > 1600)
      //       desc2 += p;
      //     else
      //       desc1 += p;
      //   })
      // } else if (spell.desc.length > 2500) {
      //   spell['@fontSize'] = '9pt';

      //   console.warn('TOO FUCKING LONG', spell.name)
      //   spell['@selected'] = true;
      
      //   let paragraphs: string[] = spell.desc.split(/(?=<p>|<li>)/g);
      //   paragraphs.forEach(p => {
        //     if (desc1.length + p.length > 1200)
        //       desc2 += p;
        //     else
        //       desc1 += p;
        //   })
        // } else if (spell.desc.length > 1200) {
      // if (spell.desc.length > 2500)
      //     spell['@selected'] = true;
      //   let paragraphs: string[] = spell.desc.split(/(?=<p>|<li>)/g);

      //   paragraphs.forEach(p => {
      //     if (desc1.length + p.length > 1200)
      //       desc2 += p;
      //     else
      //       desc1 += p;
      //   })
      // } else {
        desc1 = spell.desc;
      // }
      // console.log("🚀 ~ file: app.component.ts:48 ~ AppComponent ~ ngOnInit ~ paragraphs:", paragraphs)
if (spell.name.length > 25)
      spell['@selected'] = true;
      // desc1 = desc1.replace(/(<p|<li)(>)/g, '$1 style="page-break-inside: avoid"$2');
      
      spell['@descHtml'] = this.sanitizer.bypassSecurityTrustHtml(desc1);
      // spell['@adtlDescHtml'] = this.sanitizer.bypassSecurityTrustHtml(desc2);
      
      
      // spell['@selected'] = true;

    });

    this.spells = this.allSpells
      .sort(sortAlphabetically('name'))
      .sort(sortNumerically('level'));

      // this.selectedSpells = this
  }

  toggleSpell(spell: Spell): void {
    spell['@selected'] = !spell['@selected'];

    this.selectedSpells = this.allSpells.filter(spell => spell['@selected']);
  }

  selectClass(selected: EnumArrayItem): void {
    this.selectedSpells = this.allSpells.filter(spell => spell.class?.indexOf(<any>selected.id) !== -1)
    this.selectedSpells.forEach(spell => spell['@selected'] = true);
  }

  selectLevel(selected: number): void {
    this.selectedSpells = this.allSpells.filter(spell => spell.level === selected);
    this.selectedSpells.forEach(spell => spell['@selected'] = true);
  }

  generateSpellbook(): void {
    this.print();
    // this.generated = true;

    // setTimeout(() => {
    // }, 1000)

    // setTimeout(async () => {
    //   await new Promise((resolve) => {
    //     client.Page.loadEventFired(async () => {
    //       const pdf = await client.Page.printToPDF({
    //         displayHeaderFooter: true,
    //         footerTemplate: "<span class='pageNumber'> of <span class='totalPages'></span></span>",
    //       });
    //       resolve(pdf.data);
    //     });
    //   });
    // }, 1000)
  }

  print(): void {
    // window.print();
    let result = this.pdfGenerator.generatePdf(this.spells.filter(spell => spell['@selected']));
    console.log("🚀 ~ file: app.component.ts:152 ~ AppComponent ~ print ~ result:", result)
    // result.download();
    result.open();
    // pdfMake.createPdf(doc, { progressCallback: this.onProgress, bufferPages: true });
    // result.download();
  }

  onProgress(progress: number): void {
    console.log('PROGRESS >>> ', progress);
  }
}


