import { Allergen, Category, Dish, Ingredient, Media, Menu, Tag } from "./models";

type XLSXWorkSheet = any;
type XLSXWorkBook = any;
var XLSX = (window as any).XLSX;

export class DownloadFile {
  static download(data: Menu[], params: { [key: string]: any } = {}): void {
    new (this)(data, params).download();
  }

  private data: Menu[];
  private params: { [key: string]: any } = {};
  private readonly workbook: XLSXWorkBook = XLSX.utils.book_new();

  get filename(): string {
    return this.params['filename'];
  }

  get formatImageId(): (image: Media|null|undefined) => string {
    return this.params['formatImageId'] ?? ((image: Media) => image ? `https://laportadacqua.it/images/${image.id}.${image.extension}` : '');
  }

  readonly defaultFilename: string = 'menus';

  constructor(data: Menu[], params: { [key: string]: any } = {}) {
    this.data = data;
    this.params = params ?? {};
  }

  download(): void {
    const worksheets = this.getWorkSheets();
    Object.keys(worksheets).forEach((key: string) => XLSX.utils.book_append_sheet(this.workbook, worksheets[key], key));

    XLSX.writeFile(this.workbook, `${this.filename || this.defaultFilename}.xlsx`);
  }

  private getWorkSheets(): { [WorksheetName: string]: XLSXWorkSheet } {
    return {
      "Tutti i dati": XLSX.utils.json_to_sheet(this.allDataFormatted()),
      "Tutti i menu": XLSX.utils.json_to_sheet(this.formatMenus()),
      "Menu speciali": XLSX.utils.json_to_sheet(this.formatMenus(this.data.filter((m: Menu) => m.isSpecial == 1))),
      "Menu non speciali": XLSX.utils.json_to_sheet(this.formatMenus(this.data.filter((m: Menu) => m.isSpecial == 0))),
      "Menu abilitati": XLSX.utils.json_to_sheet(this.formatMenus(this.data.filter((m: Menu) => m.enabled == 1))),
      "Menu disabilitati": XLSX.utils.json_to_sheet(this.formatMenus(this.data.filter((m: Menu) => m.enabled == 0))),

      "Tutte le categorie": XLSX.utils.json_to_sheet(this.formatCategories()),
      "Tutti i piatti": XLSX.utils.json_to_sheet(this.formatDishes()),
    };
  }

  private formatMenus(data: Menu[] = this.data): { [key: string]: any }[] {
    return data.map((m: Menu) => {
      return this.formatMenu(m);
    });
  }

  private formatMenu(m: Menu): { [key: string]: any } {
    const columns: { [key: string]: any } = {
      nameIt: { key: `Nome menu (it)`, value: m.nameIt },
      nameEn: { key: `Nome menu (en)`, value: m.nameEn },
      price: { key: `Prezzo`, value: m.price == null ? '' : m.price },
      descriptionIt: { key: `Descrizione (it)`, value: m.descriptionIt },
      descriptionEn: { key: `Descrizione (en)`, value: m.descriptionEn },
      enabled: { key: `Abilitato`, value: m.enabled == 1 ? 'Si' : 'No' },
      special: { key: `Speciale`, value: m.isSpecial == 1 ? 'Si' : 'No' },
      priority: { key: `Priorità`, value: m.priority },
      endDate: { key: `Data fine`, value: m.endDate },
    };

    return Object.keys(columns).reduce((acc: { [key: string]: any }, key: string) => {
      const column = columns[key];
      acc[column.key] = column.value;
      return acc;
    }, {});
  }

  private formatCategories(data: Category[] = this.data.flatMap((m: Menu) => m.categories)): { [key: string]: any }[] {
    return data.map((c: Category) => {
      return this.formatCategory(c);
    });
  }

  private formatDishes(data: Dish[] = this.data.flatMap((m: Menu) => m.categories.flatMap((c: Category) => c.dishes))): { [key: string]: any }[] {
    return data.map((d: Dish) => {
      return this.formatDish(d);
    });
  }

  private formatCategory(c: Category): { [key: string]: any } {
    const columns: { [key: string]: any } = {
      nameIt: { key: `Nome categoria (it)`, value: c.nameIt },
      nameEn: { key: `Nome categoria (en)`, value: c.nameEn },
      price: { key: `Prezzo`, value: '' },
      descriptionIt: { key: `Descrizione (it)`, value: c.descriptionIt },
      descriptionEn: { key: `Descrizione (en)`, value: c.descriptionEn },
      priority: { key: `Priorità`, value: c.priority },
    };

    return Object.keys(columns).reduce((acc: { [key: string]: any }, key: string) => {
      const column = columns[key];
      acc[column.key] = column.value;
      return acc;
    }, {});
  }

  private formatDish(d: Dish): { [key: string]: any } {
    const columns: { [key: string]: any } = {
      nameIt: { key: `Nome piatto (it)`, value: d.nameIt },
      nameEn: { key: `Nome piatto (en)`, value: d.nameEn },
      price: { key: `Prezzo`, value: d.price },
      descriptionIt: { key: `Descrizione (it)`, value: d.descriptionIt },
      descriptionEn: { key: `Descrizione (en)`, value: d.descriptionEn },
      priority: { key: `Priorità`, value: d.priority },
    };

    return Object.keys(columns).reduce((acc: { [key: string]: any }, key: string) => {
      const column = columns[key];
      acc[column.key] = column.value;
      return acc;
    }, {});
  }

  private allDataFormatted(): { [key: string]: any }[] {
    const columns: string[] = [`Nome (it)`, `Nome (en)`, `Descrizione (it)`, `Descrizione (en)`, `Abilitato?`, `Prezzo`];
    // const columns: string[] = [`Nome (it)`, `Nome (en)`, `Descrizione (it)`, `Descrizione (en)`, `Abilitato?`, `Immagine`, `Prezzo`, `Ingredienti`, `Tag`, `Allergeni`];
    const rows: { [key: string]: any }[] = [];
    const addRow = (fieldType: 'Menu' | 'Categoria' | 'Piatto', values: [any, any, any, any, any, any]): void => {
      const row: { [key: string]: any } = { "Tipologia dato": fieldType };
      values.forEach((value: any, index: number) => {
        row[columns[index]] = value;
      });
      rows.push(row);
    }

    this.data.forEach((menu: Menu) => {
      addRow("Menu", [menu.nameIt, menu.nameEn, menu.descriptionIt, menu.descriptionEn, menu.enabled == 1 ? `Sì` : `No`, menu.price]);
      menu.categories.forEach((category: Category) => {
        addRow("Categoria", [category.nameIt, category.nameEn, category.descriptionIt, category.descriptionEn, category.enabled == 1 ? `Sì` : `No`, '']);
        category.dishes.forEach((dish: Dish) => {
          // const ingredients: string = (dish.ingredients || []).map((i: Ingredient) => i.nameIt).join("\n");
          // const tags: string = (dish.tags || []).map((t: Tag) => t.nameIt).join("\n");
          // const allergens: string = (dish.allergens || []).map((a: Allergen) => a.nameIt).join("\n");
          addRow("Piatto", [dish.nameIt, dish.nameEn, dish.descriptionIt, dish.descriptionEn, dish.enabled == 1 ? `Sì` : `No`, dish.price]);
          // addRow("Piatto", [dish.nameIt, dish.nameEn, dish.descriptionIt, dish.descriptionEn, dish.enabled == 1 ? `Sì` : `No`, dish.imageId, dish.price, ingredients, tags, allergens]);
        });
      });
    })

    return rows;
  }
}