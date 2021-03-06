import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from "@angular/core"
import {
    PageModel,
    updatePage,
    setActivePage,
    WebviewData,
    selectAllPagesState,
    PageState,
    selectActivePage,
} from "../../stores/page"
import { WebviewTag } from "electron"
import { Store, select } from "@ngrx/store"
import { AppState, selectPagesById, selectTabOptionsSelectTab } from "../../stores/reducers"
import { Update, Dictionary } from "@ngrx/entity"
import { PageCheck } from "../grids/grids.component"
import { Subscription } from "rxjs"
import { filter, map } from "rxjs/operators"

import { ipcRenderer } from "electron"

import { isDevMode } from "@angular/core"
import { IpcService } from "../../dialogs/dialog-settings/settings-history/ipc.service"
import { GridWebview } from "./grid-webview"

@Component({
    selector: "app-grid-item",
    templateUrl: "./grid-item.component.html",
    styleUrls: ["./grid-item.component.scss"],
})
export class GridItemComponent implements OnInit, AfterViewInit, OnDestroy {
    useragent: string =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
    webvieCallbacks: any = {}
    @Input()
    item: PageCheck

    currentTab: string

    // firstUrl: string

    @ViewChild("webview") webview: ElementRef
    @ViewChild("container") container: ElementRef

    webviewDom: any
    gridWebview: GridWebview

    constructor(private store: Store<AppState>, private ipcService: IpcService) {}
    currentPageId: string = null
    ngOnInit() {
        this.gridWebview = new GridWebview(this.store, this.ipcService, this.item)

        //Send tab-show and tab-leave to page
        this.store.pipe(select(selectTabOptionsSelectTab)).subscribe((selectedTabId: string) => {
            if (!this.gridWebview.isLoading()) {
                let webviewDom = this.webview.nativeElement
                if (this.currentTab != selectedTabId && selectedTabId == this.item.tab) {
                    webviewDom.send("tab-show")
                } else if (this.currentTab == this.item.tab && selectedTabId != this.item.tab) {
                    webviewDom.send("tab-leave")
                }
            }
            this.gridWebview.setCurrentTab(selectedTabId)
            this.currentTab = selectedTabId
        })
        //Send page-focus and page-leave to page
        this.store.pipe(select(selectActivePage)).subscribe((currentActivePage: string) => {
            if (!this.gridWebview.isLoading()) {
                let webviewDom = this.webview.nativeElement
                if (this.item.tab == this.currentTab) {
                    if (this.item.id == currentActivePage) webviewDom.send("page-focus")
                    else if (this.currentPageId == this.item.id) webviewDom.send("page-leave")
                }
            }
            this.currentPageId = currentActivePage
        })

        this.store
            .pipe(select(selectAllPagesState))
            .pipe(map((pageState: PageState) => pageState.entities[this.item.id]))
            .subscribe((page: PageModel) => {
                if (!page.urlChangeFromWebview) this.url = this.item.url
            })
        this.url = this.item.url
    }

    url: string

    ngAfterViewInit(): void {
        this.gridWebview.domReady(this.webview)

        this.container.nativeElement.addEventListener("mouseenter", event => this.onMouseOver(event))
        this.container.nativeElement.addEventListener("mouseleave", event => this.onMouseOut(event))
    }

    updatePage(changes: Partial<PageModel>) {
        this.store.dispatch(
            updatePage({
                page: { id: this.item.id, changes },
            })
        )
    }

    onMouseOver(event) {
        this.store.dispatch(setActivePage({ pageId: this.item.id, active: true }))
    }
    onMouseOut(event) {
        this.store.dispatch(setActivePage({ pageId: this.item.id, active: false }))
    }

    reload() {
        if (!this.gridWebview.isLoading()) {
            this.webview.nativeElement.reload()
            this.updatePage({ reload: false })
        }
    }
    back() {
        if (!this.gridWebview.isLoading()) {
            this.webview.nativeElement.goBack()
            this.updatePage({ back: false })
        }
    }
    forward() {
        if (!this.gridWebview.isLoading()) {
            this.webview.nativeElement.goForward()
            this.updatePage({ forward: false })
        }
    }

    ngOnDestroy(): void {
        this.gridWebview.destroy()
    }
}
