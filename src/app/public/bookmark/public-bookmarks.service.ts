import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {Webpage} from '../../core/model/webpage';
import {Bookmark} from '../../core/model/bookmark';

import {environment} from 'environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {shareReplay} from 'rxjs/operators';

@Injectable()
export class PublicBookmarksService {

  private bookmarksUrl = '';  // URL to web api
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient) {
    this.bookmarksUrl = environment.API_URL + '/public/bookmarks';
  }

  getAllBookmarks(): Observable<Bookmark[]> {
    return this.httpClient.get<Bookmark[]>(this.bookmarksUrl);
  }

  getScrapingData(url: String): Observable<Webpage> {
    return this.httpClient
      .get<Webpage>(`${this.bookmarksUrl}/scrape?url=${url}`);
  }

  getPublicBookmarkByLocation(url: string): Observable<Bookmark> {
    let params = new HttpParams();
    params = params.append('location', url);
    return this.httpClient
      .get<Bookmark>(`${this.bookmarksUrl}`, {params: params});
  }

  updateBookmark(bookmark: Bookmark): Observable<any> {
    return this.httpClient
      .put(environment.API_URL + '/private/users/' + bookmark.userId + '/bookmarks/' + bookmark._id, JSON.stringify(bookmark),
            {headers: this.headers})
      .pipe(shareReplay());
  }

}
