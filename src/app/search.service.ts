import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchModeSource = new BehaviorSubject<boolean>(false);
  searchMode$ = this.searchModeSource.asObservable();

  setSearchMode(mode: boolean) {
    this.searchModeSource.next(mode);
  }
}
