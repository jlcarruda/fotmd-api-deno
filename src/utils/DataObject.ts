import { JwtObject } from "https://deno.land/x/djwt/validate.ts"

export default class DataObject {
  public auth: JwtObject | null;
  public meta: Object;

  constructor() {
    this.auth = null
    this.meta = {}
  }
}