import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PageNotFoundComponent} from './not-found.component';

const routes: Routes = [
  {
    path: 'public',
    loadChildren: 'app/public/public.module#PublicBookmarksModule'
  },
    {
    path: 'personal',
    loadChildren: 'app/personal/personal-bookmarks.module#PersonalBookmarksModule'
  },
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

/**
 * See App routing @https://angular.io/docs/ts/latest/guide/ngmodule.html
 */
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

