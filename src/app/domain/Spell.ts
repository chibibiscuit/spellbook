import { SafeHtml } from "@angular/platform-browser";
import { ClassEnum } from "./enums/Class.enum";
import { ClericDomainEnum } from "./enums/ClericDomain.enum";
import { DruidCircleEnum } from "./enums/DruidCircle.enum";
import { PaladinOathEnum } from "./enums/PaladinOath.enum";
import { SchoolEnum } from "./enums/School.enum";
import { SourceEnum } from "./enums/Source.enum";
import { WarlockPatronEnum } from "./enums/WarlockPatron.enum";

export class Spell {
    name: string;
    desc: string;
    range: string; // convert to number
    ritual: boolean;
    duration: string; // Instantaneous / seconds / minutes / hours / days
    concentration: boolean;
    level: number;
    school: SchoolEnum;
    class?: ClassEnum[];

    verbal: boolean;
    material: boolean;
    somatic: boolean;
    
    source: SourceEnum;
    page: number;

    higher_level?: string;
    archetype?: (string)[]; // Not used, stupid
    cleric_domain?: ClericDomainEnum[];
    paladin_oath?: PaladinOathEnum[];
    druid_circle?: DruidCircleEnum[];
    warlock_patron?: WarlockPatronEnum[];

    level_desc: string;
    class_desc: string;
    range_desc: string;
    component_desc: string;
    material_desc?: string;
    material_cost?: boolean;
    archetype_desc?: string;

    '@selected'?: boolean;
    '@descHtml'?: SafeHtml;
}
