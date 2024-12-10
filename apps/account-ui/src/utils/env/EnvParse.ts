export class EnvParse {
  constructor(env?: any) {
    this.env = env;
    this.value = import.meta.env[env];
  }
  public env?: any;
  public value?: any;
  public isRequired(required?: boolean): this {
    if (required === false) {
      return this;
    }
    if (this.value === undefined || this.value === null) throw new Error(`The env "${this.env}" is required`);

    return this;
  }

  public asBoolean(): boolean {
    if (!this.value) {
      return false;
    }

    return typeof this.value === 'string' ? (this.value === 'true' || this.value === '1') : Boolean(this.value);
  }

  public asNumber(): number | undefined {
    if (!this.value) {
      return undefined;
    }

    return typeof this.value === 'string' ? Number(this.value) : this.value;
  }

  public asString<T extends string>(): string | T {
    if (!this.value) {
      return undefined as unknown as T;
    }

    return typeof this.value === 'string' ? this.value : this.value.toString();
  }
}