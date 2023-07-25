import { Component } from '@angular/core';
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
  constructor(
    private sanitizer: DomSanitizer,
  ) {

  }
  
  ngOnInit(): void {
    this.allSpells.forEach(spell => {
      //splitting time
      // if (spell.desc.length > 1000) {
      //   let desc1: string = spell.desc.substring(0, 1000);
        
      // }
      if (spell.higher_level)
        spell.desc += spell.higher_level;
      
      spell.desc = spell.desc.replace(/([1-9]+d(4|6|8|10|12|20|100)\s[\S]*\sdamage)/g, '<span style="opacity: 0.9; font-weight: bold;">$1</span>' );
      spell.desc = spell.desc.replace(/([1-9]+d(4|6|8|10|12|20|100))/g, '<span style="opacity: 0.9; font-weight: bold;">$1</span>');

      // if (spell.higher_level) {
      //   spell.higher_level = spell.higher_level.replace(/([1-9]+d(4|6|8|10|12|20|100))/g, '<span style="opacity: 0.9; font-weight: bold;">$1</span>' );
      //   spell['@higherLevelHtml'] = this.sanitizer.bypassSecurityTrustHtml(spell.higher_level);
      // }
      let desc1: string = '';
      let desc2: string = '';

      if (spell.desc.length > 3200) {
        spell['@fontSize'] = '8pt';

        console.warn('TOO FUCKING LONG', spell.name)
        spell['@selected'] = true;

        let paragraphs: string[] = spell.desc.split(/(?=<p>|<li>)/g);
        paragraphs.forEach(p => {
          if (desc1.length + p.length > 1600)
            desc2 += p;
          else
            desc1 += p;
        })
      } else if (spell.desc.length > 2500) {
        spell['@fontSize'] = '9pt';

        console.warn('TOO FUCKING LONG', spell.name)
        spell['@selected'] = true;

        let paragraphs: string[] = spell.desc.split(/(?=<p>|<li>)/g);
        paragraphs.forEach(p => {
          if (desc1.length + p.length > 1200)
            desc2 += p;
          else
            desc1 += p;
        })
      } else if (spell.desc.length > 1200) {
        let paragraphs: string[] = spell.desc.split(/(?=<p>|<li>)/g);

        paragraphs.forEach(p => {
          if (desc1.length + p.length > 1200)
            desc2 += p;
          else
            desc1 += p;
        })
      } else {
        desc1 = spell.desc;
      }
      // console.log("🚀 ~ file: app.component.ts:48 ~ AppComponent ~ ngOnInit ~ paragraphs:", paragraphs)


      
      spell['@descHtml'] = this.sanitizer.bypassSecurityTrustHtml(desc1);
      spell['@adtlDescHtml'] = this.sanitizer.bypassSecurityTrustHtml(desc2);
      
      
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

  generateSpellbook(): void {
    this.generated = true;
  }

  print(): void {
    window.print();
  }
}


