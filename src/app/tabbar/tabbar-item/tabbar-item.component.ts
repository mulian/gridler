import { Component, OnInit, Input } from '@angular/core';
import { Tab, SelectTab, UpdateTab, EditTab, NoEditTab, DeleteTab } from '../../states/tab';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../states/reducers';

@Component({
  selector: 'app-tabbar-item',
  templateUrl: './tabbar-item.component.html',
  styleUrls: ['./tabbar-item.component.scss']
})
export class TabbarItemComponent implements OnInit {
  @Input()
  tabItem:Tab

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  clickRemoveTab() {
    this.store.dispatch(new DeleteTab({id:this.tabItem.id}))
  }

  editTab() {
    this.store.dispatch(new EditTab({tabId:this.tabItem.id}))
  }

  showTab() {
    this.store.dispatch(new SelectTab({selectedTab:this.tabItem.id}));
  }

  clicked:number=0
  clickTimeOut=null
  clickTabTitle(index:string) { //TODO: Make this smarter
    this.clicked++
    if(this.clickTimeOut==null) {
      this.clickTimeOut = setTimeout(() => {
        if(this.clicked>1) { //doubleclick
          this.editTab();
        } else { //click
          this.showTab();
        }

        this.clicked=0
        this.clickTimeOut=null
      },500)
    }
  }
}
