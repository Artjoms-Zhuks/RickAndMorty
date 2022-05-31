import { CharacterService } from './../../../../shared/services/character.service';
import { Character } from './../../../../shared/interfaces/character.interface';

//import { Character } from './../../../../shared/components/interface/character.interface';
import { Component,HostListener, Inject, OnInit } from '@angular/core';
import { take} from 'rxjs/operators'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DOCUMENT } from '@angular/common';
type RequestInfo = {
  next:any;
};

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];

  info: RequestInfo = {
    next: null,
  };

  private pageNum = 1;
  private query!: string;
  private hideScrollHeight = 200;
  private showScrollHeight = 500;
  showGoUpButton = false;

  constructor(@Inject(DOCUMENT) private document:Document, private characterSvc: CharacterService, private route: ActivatedRoute) { }

  ngOnInit(): void {
   this.getDataFromService();
  }

  private getDataFromService() :void{
    this.characterSvc.searchCharacters(this.query, this.pageNum)
    .pipe(
      take(1),
    ).subscribe((res:any  ) => {
      if(res?.results?.length){
        const {info,results} = res;
      this.characters = [...this.characters, ...results];
      this.info = info;
      }
      else{
        this.characters = [];
      }
      console.log('Respone ->',res);

    });
  }

  @HostListener('window:scroll',[])
  onWindowScroll():void{
const yOffSet = window.pageYOffset;
if((yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop)> this.showScrollHeight){
this.showGoUpButton = true;
}
else if (this.showGoUpButton && (yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop)<this.hideScrollHeight){
this.showGoUpButton = false;
}


  }
  onScrollDown():void {
    if(this.info.next){
      this.pageNum++;
      this.getDataFromService();
    }
  }
  onScrollUp(): void{
  this.document.body.scrollTop =0; //for Safari Browser
  this.document.documentElement.scrollTop=0;//for others Browsers
  }

}

