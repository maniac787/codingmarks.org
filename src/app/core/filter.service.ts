
import {Injectable} from "@angular/core";
import {Bookmark} from "./model/bookmark";
import {List} from "immutable";
import {Observable} from "rxjs";

@Injectable()
export class BookmarkFilterService {

  /**
   * Filters a list of bookmarks based on the query string.
   *
   * Tags are enclosed in square brackets - e.g [angular]. The filter is now permissive, that is when starting with
   * "[" the filter assumes that the tag is what comes after even though there is no enclosing "]". That is now to support
   * the autosearch feature
   *
   * @param query - is a string of search terms; multiple terms are separated via the "+" sign
   * @param observableListBookmark - the list to be filtered
   * @returns {any} - the filtered list
   */
  filterBookmarksBySearchTerm(query:string, observableListBookmark:Observable<List<Bookmark>>): Bookmark[] {

    let termsAndTags:[string[], string[]] = this.splitSearchQuery(query);
    var terms:string[] = termsAndTags[0];
    var tags:string[] = termsAndTags[1];
    let result:Bookmark[] = [];

    observableListBookmark.subscribe(
      bookmarks => {
        let filteredBookmarks = bookmarks.toArray(); //we start with all bookmarks
        tags.forEach(tag => {
          filteredBookmarks = filteredBookmarks.filter(x => this.bookmarkContainsTag(x, tag));
        });
        terms.forEach(term => {
          filteredBookmarks = filteredBookmarks.filter(x => this.bookmarkContainsTerm(x, term.trim()));
        });

        result = filteredBookmarks;
      },
      err => {
        console.log("Error filtering bookmakrs");
      }
    );

    return result;
  }

  /**
   * It will parse the search query and returns the search terms and tags to filter.
   * It is permissive, in the sense that "[angul" is seen as the "angul" tag - needed for autocomplete
   * To see what should come out check the filter.service.spec.ts test examples
   *
   * @param query to be parsed
   * @returns a tuple of terms (first element) and tags (second element)
   */
  public splitSearchQuery(query: string):[string[], string[]]{

    let result:[string[], string[]] = [[], []];

    let terms:string[] = [];
    let term:string = '';
    let tags:string[]= [];
    let tag:string = '';

    let isInsideTerm:boolean = false;
    let isInsideTag:boolean = false;


    for(var i=0; i < query.length; i++ ){
      let currentCharacter = query[i];
      if(currentCharacter === ' '){
        if(!isInsideTag){
          if(!isInsideTerm){
            continue;
          } else {
            terms.push(term);
            isInsideTerm = false;
            term = '';
          }
        } else {
          tag += ' ';
        }
      } else if(currentCharacter === '['){
        if(isInsideTag){
          tags.push(tag.trim());
          tag = '';
        } else {
          isInsideTag = true;
        }
      } else if(currentCharacter === ']'){
        if(isInsideTag){
          isInsideTag = false;
          tags.push(tag.trim());
          tag = '';
        }
      } else {
        if(isInsideTag) {
          tag += currentCharacter;
        } else {
          isInsideTerm = true;
          term += currentCharacter;
        }
      }
    }

    if(tag.length > 0){
      tags.push(tag.trim());
    }

    if(term.length > 0){
      terms.push(term);
    }

    result[0] = terms;
    result[1] = tags;

    return result;
  }

  /**
   * Checks if one search term is present in the bookmark's metadata (name, location, description, tags)
   *
   * @param bookmark
   * @param term
   * @returns {boolean}
   */
  private bookmarkContainsTerm(bookmark: Bookmark, term: string):boolean {
    let result: boolean = false;
    if(bookmark.name.toLowerCase().indexOf(term.toLowerCase()) !== -1
      || bookmark.location.toLowerCase().indexOf(term.toLowerCase()) !== -1
      || bookmark.description.toLowerCase().indexOf(term.toLowerCase()) !== -1
      || bookmark.tags.indexOf(term.toLowerCase()) !== -1
    ){
      result=true;
    }

    if(result) {
      return true;
    } else {
      //if not found already look through the tags also
      bookmark.tags.forEach(tag => {
        if(tag.toLowerCase().indexOf(term.toLowerCase()) !== -1){
          result= true;
        }
      });
    }


    return result;
  }

  private bookmarkContainsTag(bookmark: Bookmark, tag: string):boolean {
    let result: boolean = false;
    bookmark.tags.forEach(bookmarkTag => {
      if(bookmarkTag.toLowerCase().indexOf(tag.toLowerCase()) !== -1){
        result = true;
      }
    });

    return result;
  }

}