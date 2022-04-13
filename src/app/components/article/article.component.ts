import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ActionSheetButton } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  @Input() article!: Article;
  @Input() index!: number;
  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService
  ) {}

  ngOnInit() {}
  public openArticle() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      const browser = this.iab.create(this.article.url);
      browser.show();
      return;
    }
    window.open(this.article.url, '_blank');
  }
  public async onOpenMenu() {
    const articleInFavorite = this.storageService.articleInFavorites(
      this.article
    );
    const normalBtn: ActionSheetButton[] = [
      {
        text: articleInFavorite ? 'Remover Favorito' : 'Favorito',
        icon: articleInFavorite ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite(),
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
        cssClass: 'secondary',
      },
    ];
    const shareBtn: ActionSheetButton = {
      text: 'Compartit',
      icon: 'share-outline',
      handler: () => this.onShareArticle(),
    };
    if (
      this.platform.is('capacitor') ||
      this.platform.is('cordova') ||
      this.platform.is('hybrid')
    ) {
      normalBtn.unshift(shareBtn);
    }
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtn,
    });

    await actionSheet.present();
  }
  public onShareArticle() {
    this.socialSharing.share(
      this.article.title,
      this.article.source.name,
      null,
      this.article.url
    );
  }
  public onToggleFavorite() {
    this.storageService.saveRemoveArticle(this.article);
  }
}
