import { GridsterItem } from "angular-gridster2"

export interface WebviewData {
    zoomLevel: number
    zoomFactor: number
    isDeveloperConsoleVisible: boolean
    isBackAvailable: boolean
    isForwardAvailable: boolean
    favicon: string
    scrollX: number
    scrollY: number
}

/** The Page information with GridsterItem cause every page is a gridster item */
export interface PageModel extends GridsterItem, WebviewData {
    name?: string
    id?: string
    url: string
    tab: string //The referenced tab id, there is currently no check that tab exists
    reload?: boolean
    back?: boolean
    forward?: boolean
    addressbarOpen: boolean
    isAdditionAddressbarOptionsOpen: boolean
    urlChangeFromWebview?: boolean
    isDrag: boolean
}
