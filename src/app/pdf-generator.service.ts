import { Injectable } from '@angular/core';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { Content, ContentStack, CustomTableLayout, DynamicContent, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Spell } from './domain/Spell';
// import htmlToPdfMake from 'html-to-pdfmake';
var htmlToPdfmake = require("html-to-pdfmake");

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  private pageWidth = 414;
  private pageHeight = 612;
  private pageMargins: { [position: string]: number } = {
    left: 54,
    top: 36,
    right: 54,
    bottom: 90
  } // 9 pt left or right depending on even / odd
//396 - 36 - 36
//432 - 54 - 54

  // STEPS FOR ADDING GUTTER =>
  // 1. Add two pages to front (double blank)
  // 2. Add Spell List page
    // A. Odd Pages go to left
    // B. Even Pages go to right
  



  private pageHeaderSize = 0;
  private pageFooterSize = 36;

  constructor() { 
    (pdfMake as any).fonts = {
      Spectral: {
        normal: `${window.location.origin}/assets/fonts/Spectral/Spectral-Regular.ttf`,
        bold: `${window.location.origin}/assets/fonts/Spectral/Spectral-Bold.ttf`,
        italics: `${window.location.origin}/assets/fonts/Spectral/Spectral-Italic.ttf`,
      },
      Philosopher: {
        normal: `${window.location.origin}/assets/fonts/Philosopher/Philosopher-Regular.ttf`,
        bold: `${window.location.origin}/assets/fonts/Philosopher/Philosopher-Bold.ttf`,
        bolditalics: `${window.location.origin}/assets/fonts/Philosopher/Philosopher-BoldItalic.ttf`,
        italics: `${window.location.origin}/assets/fonts/Philosopher/Philosopher-Italic.ttf`,
      },
    };
    (pdfMake as any).tableLayouts = this.tableLayouts;
  }

  generatePdf(spells: Spell[]): pdfMake.TCreatedPdf {

    let doc: TDocumentDefinitions = {
      footer: this.processPageFooter(),
      content: this.processSpellContent(spells),
      styles: this.spellStyles,
      defaultStyle: { 
        fontSize: 10,
        font: 'Philosopher',
        alignment: 'justify'
      },
      pageSize: {
        width: this.pageWidth,
        height: this.pageHeight
      },
      pageMargins: [
        this.pageMargins.left,
        this.pageMargins.top + this.pageHeaderSize,
        this.pageMargins.right,
        this.pageMargins.bottom
      ],
      images: this.images,
      // pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      pageBreakBefore: function (currentNode, nodeContainer) {
        // if ((currentNode as any).unbreakable)
          // console.log("🚀 ~ file: pdf-generator.service.ts:73 ~ PdfGeneratorService ~ generatePdf ~ doc: TDocumentDefinitions.currentNode:", currentNode)
let previousNodesOnPage: any[] = (<any>nodeContainer).getPreviousNodesOnPage();
      console.log("🚀 ~ file: pdf-generator.service.ts:82 ~ PdfGeneratorService ~ generatePdf ~ doc: TDocumentDefinitions.previousNodesOnPage:", previousNodesOnPage)
        // if (currentNode.style === 'spellName')
          // console.log('asdf', currentNode, previousNodesOnPage, previousNodesOnPage.map(node => node.style))
        // return previousNodesOnPage.length > 0 && currentNode.pageNumbers.length > 1 || currentNode.style === 'spellName' && previousNodesOnPage.some(node => node.style === 'spellName');
        return (!!previousNodesOnPage?.length && currentNode.pageNumbers.length > 1)
          || (currentNode.style === 'spellName' && previousNodesOnPage.some(node => node.style ==='html-p' || (<any>node.style)?.[0] === 'html-p' || node.style ==='html-li' || (<any>node.style)?.[0] === 'html-li'))
          // || (currentNode.style === 'spellName' && previousNodesOnPage.some(node => node.style === 'spellName'))
          // || (currentNode.style === 'spellName' && currentNode.pageNumbers[0] % 2 === 0);
      }
    };
    console.log('DOC>>>', doc);

    return pdfMake.createPdf(doc, {  });
  }

  onProgress(progress: number): void {
    console.log('PROGRESS >>> ', progress);
  }

  private processSpellContent(spells: Spell[]): Content {
    let retVal = spells.map(spell => {
      let retVal: Content = this.processSpell(spell);

      
      // console.log("🚀 ~ file: pdf-generator.service.ts:83 ~ PdfGeneratorService ~ processSpellContent ~ retVal:", retVal)

      return retVal;
    });


    // retVal.unshift(
    //   {
    //     toc: {
    //       id: 'Cantrip',
    //       title: {text: 'Cantrips', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '1st-level',
    //       title: {text: '1st Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '2nd-level',
    //       title: {text: '2nd Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '3rd-level',
    //       title: {text: '3rd Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '4th-level',
    //       title: {text: '4th Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '5th-level',
    //       title: {text: '5th Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '6th-level',
    //       title: {text: '6th Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '7th-level',
    //       title: {text: '7th Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '8th-level',
    //       title: {text: '8th Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   {
    //     toc: {
    //       id: '9th-level',
    //       title: {text: '9th Level Spells', style: 'spellHeader'},
    //       textMargin: [2, -2, 2, 0]
    //     },
    //   },
    //   { pageBreak: 'after', stack: [] }
    // );

    return retVal;
    // return spells.map(spell => {
    //   let retVal: Content = this.processSpell(spell);
    //   console.log("🚀 ~ file: pdf-generator.service.ts:83 ~ PdfGeneratorService ~ processSpellContent ~ retVal:", retVal)

    //   return retVal;
    // });
  }

  private processSpell(spell: Spell): Content {
    return [
      { text: spell.name, style: 'spellName', marginBottom: 6, marginLeft: -4, tocItem: spell.level_desc },
      // { text: spell.name, style: 'spellName', marginBottom: 6, marginLeft: -4 },
      { 
        image: spell.school, 
        absolutePosition: { y: 200, x: (this.pageWidth / 2) - 108 }, 
        width: 216, 
        style: 'spellBackground',
        opacity: 0.08
      },
      { text: this.processSpellSubtitleText(spell), style: 'spellSubtitle' },
      { stack: [
        { columns: [
          { width: 60, text: 'Casting Time', style: 'detailLabel' },
          { width: '*', text: spell.casting_time, style: 'detailValue' },
        ], style: 'spellDetail' },
        { columns: [
          { width: 60, text: 'Range', style: 'detailLabel' },
          { width: '*', text: spell.range_desc, style: 'detailValue' },
        ], style: 'spellDetail' },
        { columns: [
          { width: 60, text: 'Duration', style: 'detailLabel' },
          { width: '*', text: spell.duration, style: 'detailValue' },
        ], style: 'spellDetail' },
        { columns: [
          { width: 60, text: 'Components', style: 'detailLabel' },
          { width: '*', text: spell.component_desc, style: 'detailValue' },
        ], style: 'spellDetail' },
        ...(!spell.material ? [] : [
          { columns: [
            { width: 60, text: 'Materials', style: 'detailLabel' },
            { width: '*', text: `(${spell.material_desc})`, style: 'materials' },
          ], style: 'spellDetail' }
        ]),
      ], style: 'details' },
      ...this.processSpellDescription(spell),
    ]
  }

  private processBlankSpell(): Content {
    return [
      { text: '_________________', style: 'spellName', marginBottom: 6, marginLeft: -4 },
      // { text: spell.name, style: 'spellName', marginBottom: 6, marginLeft: -4 },
      { text: '__________', style: 'spellSubtitle' },
      { stack: [
        { columns: [
          { width: 60, text: 'Casting Time', style: 'detailLabel' },
          { width: '*', text: '__________', style: 'detailValue' },
        ], style: 'spellDetail' },
        { columns: [
          { width: 60, text: 'Range', style: 'detailLabel' },
          { width: '*', text: '__________', style: 'detailValue' },
        ], style: 'spellDetail' },
        { columns: [
          { width: 60, text: 'Duration', style: 'detailLabel' },
          { width: '*', text: '__________', style: 'detailValue' },
        ], style: 'spellDetail' },
        { columns: [
          { width: 60, text: 'Components', style: 'detailLabel' },
          { width: '*', text: '__________', style: 'detailValue' },
        ], style: 'spellDetail' },
      ], style: 'details' },
      ...this.processSpellDescription(<Spell>{ desc: '' }),
    ]
  }

  private processSpellSubtitleText(spell: Spell): string {
    let retVal = '';
    if (!spell.level)
      retVal = `${spell.school} ${spell.level_desc}`;
    else
      retVal = `${spell.level_desc} ${spell.school}`; 

    if (spell.ritual)
      retVal += ` (ritual)`;

    return retVal;
  }

  // private processSpellComponents(spell: Spell): string {
  //   let retVal = spell.component_desc;

  //   if (spell.material)
  //     retVal += ` (${spell.material_desc})`;

  //   return retVal;
  // }

  private processSpellDescription(spell: Spell): Content[] {
    let retVal = spell.desc;

    if (spell.higher_level)
      retVal += spell.higher_level;

    retVal = retVal.replace(/([1-9]+d(4|6|8|10|12|20|100)\s[\S]*\sdamage)/g, '<span style="opacity: 0.9; font-weight: bold;">$1</span>' );
    retVal = retVal.replace(/([1-9]+d(4|6|8|10|12|20|100))/g, '<span style="opacity: 0.9; font-weight: bold;">$1</span>');

    retVal = retVal.replace(/<ul>([\s\S]*?)<\/ul>/g, (r0, innerHtml) => {
      return innerHtml.replace(/<[/]?p>/g, '');
    });
    // spell.desc = spell.desc.replace(/(<li><p>)/g, '<li>');
    // spell.desc = spell.desc.replace(/(<\/p><\/li>)/g, '</li>');
    // spell.desc = spell.desc.replace(/(<li>.*<\/li>)/g, '$1').replace(/(<p>|<\/p>)/g, '');

    retVal = retVal.replace(/(<li>)/g, '$1•  ');

    let paragraphs: string[] = retVal.split(/(?=<p>|<li>)/g);

    return paragraphs.map(p => {

      let retVal = htmlToPdfmake(p, { defaultStyles: this.htmlDefaultStyles });
      // retVal.unbreakable = true;
      return retVal;
    });
  }

  // private processSpellDetails(spell: Spell): ContentStack {
  //   let retVal: ContentStack = [];
    


  //   return retVal;
  // }


  private processPageFooter(): DynamicContent {
    return (currentPage, pageCount) => {
      return {
        layout: 'footer',
        table: {
          body: [
            [
              { 
                marginBottom: 0, 
                alignment: 'center', 
                stack: [
                  { 
                    image: 'footer', 
                    width: (this.pageWidth - this.pageMargins.left - this.pageMargins.right + 8), 
                    marginLeft: this.pageMargins.left,
                    marginRight: this.pageMargins.right,
                  },
                  { 
                    text: (currentPage).toString(), 
                    alignment: 'center', 
                    style: 'pageNumber', 
                    absolutePosition: { y: 28 }
                  },
                ]
              },
            ]
          ]
        }
      }
    }
  }

  private tableLayouts: { [name: string]: CustomTableLayout } = {
    spellLayout: {
      vLineWidth: (i, node) => i === 0 || i === node.table.widths?.length ? 1 : 0,
      hLineWidth: () => 1,
      hLineColor: () => "#bbb",
      vLineColor: () => "#bbb",
      paddingLeft: () => 16,
      paddingRight: () => 16,
      fillColor: (i) => i % 2 === 0 ? "#f5f5f5" : ""
    },
    footer: {
      vLineWidth: () => 0,
      hLineWidth: () => 0,
      paddingLeft: () => this.pageMargins.left - 4,
      paddingRight: () => this.pageMargins.right - 4,
    }
  }

  private htmlDefaultStyles: StyleDictionary = {
    b: {bold:true},
    strong: {bold:true},
    u: {decoration:'underline'},
    s: {decoration: 'lineThrough'},
    em: {italics:true},
    i: {italics:true},
    h1: {fontSize:24, bold:true, marginBottom:5},
    h2: {fontSize:22, bold:true, marginBottom:5},
    h3: {fontSize:20, bold:true, marginBottom:5},
    h4: {fontSize:18, bold:true, marginBottom:5},
    h5: {fontSize:16, bold:true, marginBottom:5},
    h6: {fontSize:14, bold:true, marginBottom:5},
    a: {color:'blue', decoration:'underline'},
    strike: {decoration: 'lineThrough'},
    p: {
      margin:[0, 6, 0, 8]
    },
    ul: {
      marginBottom:5
    },
    li: {
      marginTop: 6,
      marginBottom: 6,
      marginLeft: 16,
      marginRight: 16,
      leadingIndent: -9,
    },
    table: {marginBottom:5},
    th: {bold:true, fillColor:'#EEEEEE'},
    td: { }
  }

  private spellStyles: StyleDictionary = {
    spellBackground: {
      opacity: 0.05,
    },
    spellName: {
      font: 'Spectral',
      fontSize: 30,
      alignment: 'left',
      lineHeight: 0.65,
    },
    spellSubtitle: {
      fontSize: 12,
      opacity: 0.8,
      italics: true,
      marginTop: 4,
    },
    details: {
      marginTop: 8,
      marginBottom: 12,
    },
    detailLabel: {
      bold: true,
    },
    detailValue: {
      marginLeft: 8,
      marginBottom: 1,
    },
    footer: {
      opacity: 0.8,
    },
    materials: {
      opacity: 0.8,
      italics: true,
      marginLeft: 8,
    },
    spellHeader: {
      bold: true,
      marginTop: 6
    }
  }

  private images = {
    footer: `${window.location.origin}/assets/images/footer.jpg`,
    Abjuration: `${window.location.origin}/assets/images/schools/Abjuration.png`,
    Conjuration: `${window.location.origin}/assets/images/schools/Conjuration.png`,
    Divination: `${window.location.origin}/assets/images/schools/Divination.png`,
    Enchantment: `${window.location.origin}/assets/images/schools/Enchantment.png`,
    Evocation: `${window.location.origin}/assets/images/schools/Evocation.png`,
    Illusion: `${window.location.origin}/assets/images/schools/Illusion.png`,
    Necromancy: `${window.location.origin}/assets/images/schools/Necromancy.png`,
    Transmutation: `${window.location.origin}/assets/images/schools/Transmutation.png`,
  }
}
