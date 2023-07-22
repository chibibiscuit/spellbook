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
      spell['@descHtml'] = this.sanitizer.bypassSecurityTrustHtml(spell.desc)
    })
    console.log('spells', spells)
    this.spells = this.allSpells
      .sort(sortAlphabetically('name'))
      .sort(sortNumerically('level'));
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


