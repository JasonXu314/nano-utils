export type Primitive = number | string | boolean | null;
export type JSONObject = { [key: string | number]: JSONValue };
export type JSONValue = Primitive | JSONObject[] | JSONObject;
export type ChangeListener = (propertyPath: string, newValue: any, oldValue?: any) => void;
