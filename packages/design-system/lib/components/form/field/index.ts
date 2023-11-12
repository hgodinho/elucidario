import { FieldProvider } from "./FieldProvider";
import { FieldRoot } from "./FieldRoot";
import { FieldLabel } from "./FieldLabel";
import { FieldDescription } from "./FieldDescription";
import type { FieldType } from "@elucidario/pkg-types";

// hooks
export * from "./useFieldComponent";
export * from "./useFieldProvider";

const Field: FieldType = {
    Provider: FieldProvider,
    Root: FieldRoot,
    Label: FieldLabel,
    Description: FieldDescription,
};

export default Field;
