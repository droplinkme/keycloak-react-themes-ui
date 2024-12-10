import { EnvParse } from "./EnvParse";

export class EnvVar {
  protected value: any;
  public parse(value: string): EnvParse {
    return new EnvParse(value);
  }
}