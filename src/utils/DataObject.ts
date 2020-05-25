// import { JwtObject } from "https://deno.land/x/djwt/validate.ts"
import { GenericObject } from "../types.ts";

export default class DataObject {
  public auth: GenericObject | null;

  constructor() {
    this.auth = null
  }
}