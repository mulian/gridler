import { Component, OnInit, Input } from "@angular/core"
import { Update } from "@ngrx/entity"
import { updatePage, PageModel, deletePage, selectActivePage, WebviewData } from "../../stores/page"
import { AppState } from "../../stores/reducers"
import { Store, select } from "@ngrx/store"
import * as _ from "lodash-es"
import * as encodeUrl from "encodeurl"

@Component({
    selector: "app-addressbar",
    templateUrl: "./addressbar.component.html",
    styleUrls: ["./addressbar.component.scss"],
})
export class AddressbarComponent implements OnInit {
    @Input() item
    @Input() callbacks
    @Input() webview

    isPageActiv: boolean = false

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.store.pipe(select(selectActivePage)).subscribe((currentActivePage: string) => {
            if (this.item.id == currentActivePage) this.isPageActiv = true
            else this.isPageActiv = false
        })
    }

    selectAll(target) {
        let selection: Selection = window.getSelection()
        let range = document.createRange()
        range.selectNodeContents(target)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    updatePage(changes: Partial<PageModel>) {
        this.store.dispatch(
            updatePage({
                page: { id: this.item.id, changes },
            })
        )
    }

    zoomMax: number = 5
    zoomMin: number = -2
    zoomItteration: number = 0.4
    zoomIn() {
        if (this.item.zoomLevel != this.zoomMax) {
            let newZoomLevel: number = this.item.zoomLevel + this.zoomItteration
            if (newZoomLevel > this.zoomMax) newZoomLevel = this.zoomMax
            this.updatePage({
                zoomLevel: newZoomLevel,
            })
        }
    }
    zoomOut() {
        if (this.item.zoomLevel != this.zoomMin) {
            let newZoomLevel: number = this.item.zoomLevel - this.zoomItteration
            if (newZoomLevel < this.zoomMin) newZoomLevel = this.zoomMin
            this.updatePage({
                zoomLevel: newZoomLevel,
            })
        }
    }
    zoomReset() {
        this.updatePage({
            zoomLevel: 0,
        })
    }

    openDevToggle() {
        this.updatePage({ isDeveloperConsoleVisible: !this.item.isDeveloperConsoleVisible })
    }

    reloadPage() {
        this.updatePage({ reload: true })
    }
    back() {
        this.updatePage({ back: true })
    }
    forward() {
        this.updatePage({ forward: true })
    }

    toggleAddressbar() {
        this.updatePage({ addressbarOpen: !this.item.addressbarOpen })
    }

    showAdditionalOptions() {
        this.updatePage({ isAdditionAddressbarOptionsOpen: !this.item.isAdditionAddressbarOptionsOpen })
    }

    private urlPrefix: RegExp = /^(file)|(https?):\/\//
    private urlPostFix: RegExp = /\.[a-zA-Z]{2,3}/
    private autoUpdateUrl(url: string): string {
        if (!this.urlPrefix.test(url)) {
            if (!this.urlPostFix.test(url)) {
                //if pre and postfix is wrong search on google
                url = "http://google.de/search?q=" + encodeUrl(url)
            } else {
                //if only prefix is wrong, add http:// prefex to url
                url = "http://" + url
            }
        }
        return url
    }
    changePage(url: string) {
        if (url != this.item.url) {
            url = this.autoUpdateUrl(url)

            this.updatePage({
                url: url,
                urlChangeFromWebview: false,
            })
        }
    }
    changePageWithEvent(value: string, event) {
        event.preventDefault()
        event.stopPropagation()
        this.changePage(value)
    }

    removePage(event: Event) {
        event.preventDefault()
        event.stopPropagation()
        this.store.dispatch(deletePage({ id: this.item.id }))
        this.item.isDeleted = true
    }
}
