import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from '../../interfaces/index';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  public articles: Article[] = [];
  constructor(private newsService: NewsService) {}
  ngOnInit(): void {
    this.newsService.getTopHeadLines().subscribe((articles) => {
      this.articles.push(...articles);
    });
  }
  public loadData() {
    this.newsService
      .getTopHeadLinesByCategory('business', true)
      .subscribe((articles) => {
        if (articles.length === this.articles.length) {
          this.infiniteScroll.disabled = true;
          // event.target.disabled = true;
          return;
        }
        this.articles = articles;
        this.infiniteScroll.complete();
        // event.target.complete();
      });
  }
}
