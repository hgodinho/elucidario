import { useContext } from "react";

import { SystemContext } from "./SystemProvider";

export const useSystemProvider = () => useContext(SystemContext);