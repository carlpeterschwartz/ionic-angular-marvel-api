import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarvelapiService, Character, CharacterDataWrapper } from 'src/app/services/marvelapi.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.page.html',
  styleUrls: ['./character-details.page.scss'],
})

export class CharacterDetailsPage implements OnInit {

  //CharacterDetailsResult!: ApiWrapperCharacterDetailsResponse;
  //details!: CharacterDetails[];
  detailsResult!: CharacterDataWrapper;
  details!: Character; //Created empty any array for the values to display on html page

  constructor(
    private route: ActivatedRoute,
    private marvelapi: MarvelapiService
  ) { }

  ngOnInit() {
    //Hennings approach from Friday Dec 23 teams meeting to access the object from the services instead of hitting the characters/?id endpoint

    //let unfilteredResults = this.marvelapi.serviceStorage;
    //let filteredResults = array.filter.
    //this.details = filteredResults;
    //console.log(filteredResults);

    this.details = this.marvelapi.latestClickedCharacter;
    console.log(this.details);

    //Previous approach below of doing another api get request to fetch the character-details results for that id
    // const id = this.route.snapshot.paramMap.get('id');
    // this.marvelapi.getCharacterDetails(id).subscribe((res) => {
    //   this.detailsResult = res;
    //   this.details = res.data.results[0];
    //   //console.log('id:',id);
    //   console.log(res.data.results);
    // });
  }

}
