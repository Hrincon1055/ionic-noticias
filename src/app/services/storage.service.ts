/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  get getLocalArticles() {
    return [...this._localArticles];
  }

  public async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }
  public async saveRemoveArticle(article: Article) {
    const exists = await this._localArticles.find(
      (localArticle) => localArticle.title === article.title
    );
    if (exists) {
      this._localArticles = this._localArticles.filter(
        (localArticle) => localArticle.title !== article.title
      );
    } else {
      this._localArticles = [article, ...this._localArticles];
    }
    this._storage.set('articles', this._localArticles);
  }
  public async loadFavorites() {
    try {
      const articles = await this._storage.get('articles');
      this._localArticles = articles || [];
    } catch (error) {}
  }
  public articleInFavorites(article: Article) {
    return !!this._localArticles.find(
      (localArticle) => localArticle.title === article.title
    );
  }
}
