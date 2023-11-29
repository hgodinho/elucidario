import { HTMLAttributes } from "react";
import { Component } from "../components";

export type BodyProps = Component<HTMLAttributes<HTMLBodyElement>> & {
    body?: boolean;
};
