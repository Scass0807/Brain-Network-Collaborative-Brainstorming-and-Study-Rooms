import { Component, OnInit } from '@angular/core';

declare var jQuery: any;
declare var AwwBoard:any;
declare var initToolbar: any;
@Component({
  selector: 'app-theboard',
  templateUrl: './theboard.component.html',
  styleUrls: ['./theboard.component.css']
})
export class TheboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    (function ($) {
      $(document).ready(function(){
        var aww = new AwwBoard('#aww-wrapper', {
          apiKey: '424db7a1-84c2-4cba-8154-f8d7a2ecaae4'


        });
        $.ajax({
          'method': 'GET',
          'url': 'https://awwapp.com/static/widget/sample_toolbar.html'
        }).done(function(res, status) {
          console.log(res)
          $('#aww-wrapper').append(res);
          initToolbar();
        })(jQuery);
      })

    })
  }

}
