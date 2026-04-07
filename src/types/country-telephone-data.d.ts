declare module "country-telephone-data" {
  const data: {
    name: string;
    iso2: string;
    dialCode: string;
    priority?: number;
    areaCodes?: string[];
  }[];

  export default data;
}