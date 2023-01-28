import { Component, OnInit } from '@angular/core';

/** button for fixture key */
@Component({
  selector: 'app-fixture-key',
  template: `
  <button class="button" [matMenuTriggerFor]="key">Key</button>
   <mat-menu #key="matMenu" yPosition="above">
       <div class=container>
       <div class=box style="background: #ff0000"> </div>  1 weeks<br>
       <div class=box style="background: #ff8800"> </div>  2 weeks<br>
       <div class=box style="background: #ffff00"> </div>  3 weeks<br>
       <div class=box style="background: #00ff00"> </div>  4 weeks<br>
       <div class=box style="background: #0088ff"> </div>  5 weeks<br>
       <div class=box style="background: #8800ff"> </div>  6 weeks<br>
       <div class=box style="background: #666666"> </div>  greater than 6 weeks<br><br>

       <span class=small>Based on design for previous fixture display by Ollie OBrian.</span><br>
       <span class=small>Fixtures from British Oreinteering Federation.</span>
    </div>
   </mat-menu>
  `,
  styles: [
    ' .button { background-color: transparent; border: none; outline: none; font-size: 16px; }',
    ' .button:focus { border: none;}',
    ' .button:hover { background-color: rgb(255,255,255, 0.5); }',
    ' .box { width:10px; height:10px; border:1px solid; display: inline-block}',
    ' .container { padding:8px; color: gray; }',
    ' .small { font-size: 10px; }'
  ]
})
export class FixtureKeyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}







