import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  NewsResponse,
  Article,
  ArticlesByCategoriesAndPage,
} from '../interfaces';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { storedArticlesByCategory } from '../data/mock-news';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private articlesByCategoriesAndPage = storedArticlesByCategory;
  constructor(private http: HttpClient) {}

  public getTopHeadLines(): Observable<Article[]> {
    return this.getTopHeadLinesByCategory('business');
  }
  public getTopHeadLinesByCategory(
    category: string,
    loadMore: boolean = false
  ): Observable<Article[]> {
    return of(this.articlesByCategoriesAndPage[category].articles);
    if (loadMore) {
      return this.getArticlesByCategory(category);
    }
    if (this.articlesByCategoriesAndPage[category]) {
      return of(this.articlesByCategoriesAndPage[category].articles);
    }
    return this.getArticlesByCategory(category);
  }
  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (Object.keys(this.articlesByCategoriesAndPage).includes(category)) {
      // si existe
      // this.articlesByCategoriesAndPage[category].page += 0;
    } else {
      this.articlesByCategoriesAndPage[category] = {
        page: 0,
        articles: [],
      };
    }
    const page = this.articlesByCategoriesAndPage[category].page + 1;
    return this.executeQuery<NewsResponse>(
      `/top-headlines?category=${category}&page=${page}`
    ).pipe(
      map(({ articles }) => {
        if (articles.length === 0) {
          return this.articlesByCategoriesAndPage[category].articles;
        }
        this.articlesByCategoriesAndPage[category] = {
          page,
          articles: [
            ...this.articlesByCategoriesAndPage[category].articles,
            ...articles,
          ],
        };
        return this.articlesByCategoriesAndPage[category].articles;
      })
    );
  }
  private executeQuery<T>(endpoint: string) {
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: {
        apiKey,
        country: 'us',
      },
    });
  }
}
