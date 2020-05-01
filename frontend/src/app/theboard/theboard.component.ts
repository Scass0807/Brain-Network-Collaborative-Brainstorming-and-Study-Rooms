import { Component, OnInit } from '@angular/core';

declare var jQuery: any;
declare var AwwBoard:any;
declare var initToolbar: any;
declare var $: any;
export var aww : object;
@Component({
  selector: 'app-theboard',
  templateUrl: './theboard.component.html',
  styleUrls: ['./theboard.component.css']
})
export class TheboardComponent implements OnInit {
  constructor() { }
  ngOnInit() {
      aww = new AwwBoard('#aww-wrapper', {
      /* make sure you're using your own key here */
      apiKey: '424db7a1-84c2-4cba-8154-f8d7a2ecaae4',
    });
     console.log("Type" + (typeof aww));
    $.ajax({
      'method': 'GET',
      'url': 'https://awwapp.com/static/widget/sample_toolbar.html'
    }).done(function(res, status) {
      $('#aww-wrapper').append(res);
      initToolbar();
    });


  }

}

