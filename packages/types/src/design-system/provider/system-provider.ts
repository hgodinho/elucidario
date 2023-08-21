
export type SystemContextProps = {
    lang?: string
}

export type SystemState = {
    lang: string
}

export type SystemContextProvider = SystemState & {

}

export type SystemAction = {
    type: string
    payload: any
}

