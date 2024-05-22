import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

declare var $: any;


declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-live-preview',
  templateUrl: './live-preview.component.html',
  styleUrls: ['./live-preview.component.scss']
})
export class LivePreviewComponent implements OnInit {

  image1: string = '';
  image2: string = '';
  imageList: string[] = [];

  public tableData1: TableData = { headerRow: [], dataRows: [] };


  constructor(
    private router: Router,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.chatService.getNewImage1().subscribe((image1: string) => {
      this.imageList.push(image1);
      this.image1 = image1;

    });
    this.chatService.getNewImage2().subscribe((image2: string) => {
      this.imageList.push(image2);
      this.image2 = image2;
    });
    this.tableData1 = {
      headerRow: ['ID', 'Result', 'TimeStamp'],
      dataRows: [
        ['1', 'OK', '2024-05-21 14:30:00'],
        ['2', 'NOT OK', '2024-05-21 14:32:00'],
        ['3', 'OK', '2024-05-21 14:33:00'],
        ['4', 'OK', '2024-05-21 14:34:00']
      ]
    };
  }

  toInfoPage(selectedImage: string): void {
    this.router.navigate(['/info-page', { image: selectedImage }]);
  }
  showNotification(from: any, align: any) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    var color = Math.floor((Math.random() * 4) + 1);
    $.notify({
      icon: "pe-7s-bell",
      message: "New Can Inspection - Result: <b>NOT OK </b>"
    }, {
      type: type[color],
      timer: 1000,
      placement: {
        from: from,
        align: align
      },
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
        '<span data-notify="icon"></span> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }
  showDefinedNotification(from: any, align: any, type: any, message: any) {

    var color = Math.floor((Math.random() * 4) + 1);
    $.notify({
      icon: "pe-7s-bell",
      message: message
    }, {
      type: type,
      timer: 1000,
      placement: {
        from: from,
        align: align
      }
    });
  }
}
