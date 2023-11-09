import type { Input as InputType } from "@elucidario/pkg-types";

export const Input: InputType = ({ children, ...props }) => {
    return (
        <input {...props} className="input p-2 text-md border border-black" />
    );
};
