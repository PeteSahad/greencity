import { Component, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
/*
  Generated class for the Progressbar component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'progressbar',
  templateUrl: 'progressbar.html',
})
export class ProgressbarComponent {

  @Input() percentage: string;
  @Input() selector: string;

  constructor() {
    var el = document.getElementById(this.selector); // get canvas

    var options = {
      percent: el.getAttribute('data-percent') || "25",
      size: el.getAttribute('data-size') || "220",
      lineWidth: el.getAttribute('data-line') || "15",
      rotate: el.getAttribute('data-rotate') || "0"
    }

    var canvas = document.createElement('canvas');
    var span = document.createElement('span');
    span.textContent = options.percent + '%';


    var ctx = canvas.getContext('2d');
    canvas.width = canvas.height = parseInt(options.size);

    el.appendChild(span);
    el.appendChild(canvas);

    ctx.translate(parseInt(options.size) / 2, parseInt(options.size) / 2); // change center
    ctx.rotate((-1 / 2 + parseInt(options.rotate) / 180) * Math.PI); // rotate -90 deg

    //imd = ctx.getImageData(0, 0, 240, 240);
    var radius = (parseInt(options.size) - parseInt(options.lineWidth)) / 2;

    var drawCircle = function (color, lineWidth, percent) {
      percent = Math.min(Math.max(0, percent || 1), 1);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
      ctx.strokeStyle = color;
      ctx.lineCap = 'round'; // butt, round or square
      ctx.lineWidth = lineWidth
      ctx.stroke();
    };

    drawCircle('#efefef', options.lineWidth, 100 / 100);
    drawCircle('#555555', options.lineWidth, parseInt(options.percent) / 100);
    
  }

}
