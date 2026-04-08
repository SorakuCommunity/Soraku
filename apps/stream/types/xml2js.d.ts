declare module "xml2js" {
  export function parseString(
    xml: string,
    callback: (err: Error | null, result: any) => void
  ): void;
  export function parseStringPromise(xml: string): Promise<any>;
  export class Builder {
    constructor(options?: any);
    buildObject(obj: any): string;
  }
  export class Parser {
    constructor(options?: any);
    parseString(
      xml: string,
      callback: (err: Error | null, result: any) => void
    ): void;
    parseStringPromise(xml: string): Promise<any>;
  }
}
