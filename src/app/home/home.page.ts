import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { CharacterDataWrapper, Character, ComicDataWrapper, Comic, MarvelapiService } from '../services/marvelapi.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  apiResult!: CharacterDataWrapper;
  offset = 0;
  count = 20;
  //characters!: Character[];
  characters: any = []; //Initialize the character array to enrich later in loadCharacters
  comicsResult!: ComicDataWrapper;
  comics: any = [];


  constructor(
    private marvelapi: MarvelapiService,
    private loadingCtrl: LoadingController,
    private router: Router //Added with Henning on Friday Dec 23 headaches solution meeting
  ) {}

  ngOnInit() {
    this.loadComics();
    this.loadCharacters();
  }

  async loadComics() {
    this.marvelapi.getComics().subscribe(
      (res) => {
        this.comicsResult = res;
        //console.log(this.apiResult.data.results);
        this.comics = this.comicsResult.data.results;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // async loadCharacters() {
  //   this.marvelapi.getCharacters().subscribe(
  //     (res) => {
  //       this.apiResult = res;
  //       console.log(this.apiResult.data.results);
  //       this.characters = this.apiResult.data.results;
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  async loadCharacters( event?: InfiniteScrollCustomEvent ) {

    //Create the Loading... toast
    const loading = await this.loadingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });

    //Present the Loading... test
    await loading.present();

    this.marvelapi.getCharacters(this.offset).subscribe(
      (res) => {
        loading.dismiss(); //Remove loading when results
        this.apiResult = res;

        //OLD WAY: Enrich the characters array with the pushed res.data.results
        //this.characters.push(...res.data.results);

        //NEW WAY: Henning's USB-stick method from Friday Dec 23 teams meeting
        this.apiResult.data.results.forEach(receivedCharacter => {
          //console.log(receivedCharacter);
          this.characters.push(receivedCharacter); //Enrich the characters array with results from the API request
        });

        //NOT-USED NEW WAY of storing all enriched results in bucket on marvelapi service for later access on details. serviceStorage will get HUGE. not recommended.
        //this.marvelapi.serviceStorage = this.characters;

        //Increment the offset by 20 to get the next 20 results from the api
        //Also increment the count to track how many results we have fetched so far
        //Disable the Infinite Scroll if the count becomes greater than the available total from the api
        event?.target.complete();
        if (event) {
          event.target.disabled = this.count > res.data.total;
        }
        //console.log(this.count);
        //console.log(res.data.total);
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.offset+=20;
    this.count+=20;
    this.loadCharacters(event);

  }

  //Henning's new way: programmatic approach for routing or navigating instead of using routerLink
  openCharacterDetailsPage(character:Character){
    //console.log(character);
    this.marvelapi.latestClickedCharacter = character; //Pass only the clicked character object/properties to the temporary latestClickedCharacter "container" in the service
    console.log(this.marvelapi.latestClickedCharacter); //Test and see that the character object and its properties are in console.log
    this.router.navigate(['/character-details/' + character.name]) //Open the character-details page! Does NOT use routerLink, the url looks ugly, but no extra http request needed
  }

}
