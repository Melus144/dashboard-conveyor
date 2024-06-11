import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { DataService, TableData } from '../../services/data.service';

declare var $: any;

@Component({
  selector: 'app-live-preview',
  templateUrl: './live-preview.component.html',
  styleUrls: ['./live-preview.component.scss']
})
export class LivePreviewComponent implements OnInit {
  latestImage: string = '';
  latestOkImage: string = '';
  latestNotOkImage: string = '';
  imageList: string[] = [];
  showLivePreview: boolean = false;
  okCount: number = 0;
  notOkCount: number = 0;
  simulationMode: boolean = false;
  @ViewChild('videoElement') videoElement!: ElementRef;

  public tableData1: TableData = { headerRow: [], dataRows: [] };
  private simulationIntervals: any[] = [];

  constructor(
    private router: Router,
    private chatService: ChatService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getTableData().subscribe(data => {
      this.tableData1 = data;
    });

    this.chatService.getNewImage1().subscribe((image: string) => {
      if (image != '') {
        this.imageList.push(image);
        this.latestImage = image;
        this.latestOkImage = image;
        this.okCount++;
        const timestamp = new Date().toLocaleString();
        const newEntry = [this.imageList.length.toString(), 'OK', timestamp, image];
        this.dataService.addTableRow(newEntry);
        this.dataService.addOkCount();
      }
    });
    this.chatService.getNewImage2().subscribe((image: string) => {
      if (image != '') {
        this.imageList.push(image);
        this.latestImage = image;
        this.latestNotOkImage = image;
        this.notOkCount++;
        const timestamp = new Date().toLocaleString();
        const newEntry = [this.imageList.length.toString(), 'NOT OK', timestamp, image];
        this.dataService.addTableRow(newEntry);
        this.dataService.addNotOkCount();
        this.showDefinedNotification('top', 'right', 'danger', 'New <b>NOT OK </b> Can Inspection');
      }
    });
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


  toggleLivePreview(): void {
    this.showLivePreview = !this.showLivePreview;
    if (this.showLivePreview) {
      this.startLivePreview();
    } else {
      this.stopLivePreview();
    }
  }

  startLivePreview(): void {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();
    }).catch(err => console.error(err));
  }

  stopLivePreview(): void {
    const stream = this.videoElement.nativeElement.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track: any) => {
        track.stop();
      });
    }
    this.videoElement.nativeElement.srcObject = null;
  }
  toggleSimulationMode(): void {
    this.simulationMode = !this.simulationMode;
    if (this.simulationMode) {
      this.startSimulation();
    } else {
      this.stopSimulation();
    }
  }
  startSimulation(): void {
    // Clear any existing intervals
    this.stopSimulation();

    this.simulationIntervals.push(setInterval(() => {
      const simulatedImage1 = '../../../assets/images/test_can_OK.png';
      this.chatService.image1$.next(simulatedImage1);
    }, 10000));

    this.simulationIntervals.push(setInterval(() => {
      const simulatedImage2 = '../../../assets/images/test_can_NOTOK.png';
      this.chatService.image2$.next(simulatedImage2);
    }, 17000));
  }

  stopSimulation(): void {
    this.simulationIntervals.forEach(interval => clearInterval(interval));
    this.simulationIntervals = [];
  }

  stopSystem(): void {
    console.log('System stopped successfully');
    this.showDefinedNotification('top', 'center', 'danger', 'System has been stopped');
    /*
    this.systemControlService.stopSystem().subscribe(
      response => {
        console.log('System stopped successfully', response);
        this.showDefinedNotification('top', 'center', 'danger', 'System has been stopped');
      },
      error => {
        console.error('Error stopping system', error);
      }
    );
    */
  }

  resumeSystem(): void {
    console.log('System resumed successfully');
    this.showDefinedNotification('top', 'center', 'success', 'System has been resumed');

    /*
    this.systemControlService.resumeSystem().subscribe(
      response => {
        console.log('System resumed successfully', response);
        this.showDefinedNotification('top', 'center', 'success', 'System has been resumed');
      },
      error => {
        console.error('Error resuming system', error);
      }
    ); */
  }
}