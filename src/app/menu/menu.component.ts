import { Component, OnInit } from "@angular/core"
import { AppState, selectTabSlide } from "../stores/reducers"
import { Store, select } from "@ngrx/store"
import { addPage } from "../stores/page"
import { addTab, deleteTab } from "../stores/tab"
import { TranslateService } from "@ngx-translate/core"
import { SlideService } from "../slide/slide.service"
import { Observable } from "rxjs"
import { ShowDialog, DialogType } from "../stores/dialog"
import { IpcService } from "../dialogs/dialog-settings/settings-history/ipc.service"
import { SlideState } from "../stores/slide/slide.reducer"

@Component({
    selector: "app-menu",
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
    slideOptions: SlideState

    constructor(private store: Store<AppState>, public translate: TranslateService, private ipcRenderer: IpcService) {}

    ngOnInit() {}

    showHelp() {
        this.store.dispatch(new ShowDialog({ dialog: DialogType.HELP }))
    }
    showSettings() {
        this.store.dispatch(new ShowDialog({ dialog: DialogType.SETTINGS }))
    }

    //Tab Menu
    addPage() {
        let once = false
        let subscribe = this.store.subscribe(s => {
            if (!once) {
                once = true
                this.store.dispatch(
                    addPage({
                        cols: 1,
                        url: "http://google.de",
                        tab: s.tabs.options.selectedTab,
                        x: 0,
                        y: 0,
                        rows: 1,
                        addressbarOpen: true,
                        isAdditionAddressbarOptionsOpen: false,

                        zoomFactor: 1,
                        zoomLevel: 1,
                        isDeveloperConsoleVisible: false,
                        isBackAvailable: false,
                        isForwardAvailable: false,
                        favicon: null,
                        scrollX: 0,
                        scrollY: 0,
                        isDrag: false,
                    })
                )
                subscribe.unsubscribe()
            }
        })
    }
    closeApp() {
        this.ipcRenderer.send("close-app", null)
    }
    addTab() {
        this.store.dispatch(
            addTab({
                name: this.translate.instant("TAB.NEW_TAB_PLACE_HOLDER"),
                sortNumber: null,
                isSlideConsidered: true,
            })
        )
    }

    removeTab() {
        this.store.dispatch(
            deleteTab({
                tabId: null,
            })
        )
    }
}
