import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';

import olView from 'ol/View';
import olMap from 'ol/Map';
import olFeature from 'ol/Feature';
import olGeolocation from 'ol/Geolocation';
import { Coordinate } from 'ol/coordinate';

import { 
  Circle as olStyleCircle, 
  Fill as olStyleFill, 
  Stroke as olStyleStroke, 
  Style as olStyle 
} from 'ol/style';

import olLayerVector from 'ol/layer/Vector';
import olLayerTile from 'ol/layer/Tile';


import Point from 'ol/geom/Point';

import olSourceVector from 'ol/source/Vector';
import {
  default as olSourceOSM,
  ATTRIBUTION as olSourceOSMAttribution
} from 'ol/source/OSM';

import {
  Attribution as olControlAttribution,
  FullScreen as olControlFullScreen,
  defaults as olControlDefaultControls
} from 'ol/control';
import { ApiService, SpabLog } from 'src/app/service/api.service';
import { UtilsService } from 'src/app/service/utils.service';



@Component({
  selector: 'spab-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy  {

  @ViewChild('mainMap') mainMapElem!: ElementRef;
  @ViewChild('clientSelect') clientSelect!: ElementRef;
  @ViewChildren('clientCameras') clientCameras!: QueryList<ElementRef>;


  private _mainMap: olMap;

  clientSelectItems: {
    selected: boolean,
    text: string,
    clientId: string
  }[] = [];

  cameraNames = new Set<string>();

  private _clientSelectValue: string = '';

  get clientSelectValue() {
    return this._clientSelectValue;
  }

  set clientSelectValue(clientId: string) {
    this._clientSelectValue = clientId;

    setTimeout(async () => {
      this.removeCamResizeListeners();
      this.cameraNames = new Set<string>();

      await this.apiService.unsubscribeAll();

      if (clientId !== '') {
        await this.apiService.subscribe(clientId);

        let client = this.apiService.getClient(clientId);

        if (client) {
          for (let spabLog of client.latestLogs) {
            this.renderLog(clientId, spabLog);
          }
        }
      }
    }, 0);
  }


  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    let initPosSet = false;
    let currentPos: Coordinate | undefined = [0, 0];

    let mapView = new olView({
      center: [0, 0],
      zoom: 1,
    });

    // current position marker
    let mapPosFeature = new olFeature();
    mapPosFeature.setStyle(
      new olStyle({
        image: new olStyleCircle({
          radius: 10,
          fill: new olStyleFill({
            color: '#3399CC',
          }),
          stroke: new olStyleStroke({
            color: '#fff',
            width: 3,
          })
        })
      })
    );

    let mapGeolocation = new olGeolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      tracking: true,
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: mapView.getProjection()
    });

    mapGeolocation.on('change:position', function () {
      currentPos = mapGeolocation.getPosition();
      let geo = currentPos ? new Point(currentPos) : null;

      if (geo) {
        mapPosFeature.setGeometry(geo);

        if (!initPosSet) {
          mapView.fit(geo, {
            maxZoom: 12
          });
          initPosSet = true;
        }
      }
    });

    let mapMarkerLayer = new olLayerVector({
      source: new olSourceVector({
        features: [mapPosFeature],
      })
    });

    let openSeaMapLayer = new olLayerTile({
      source: new olSourceOSM({
        opaque: false,
        url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
      })
    });

    // '© <a href="http://www.openseamap.org/">OpenSeaMap</a> contributors.',
    // olSourceOSMAttribution

    this._mainMap = new olMap({
      controls: [],
      layers: [
        new olLayerTile({
          source: new olSourceOSM()
        }),
        openSeaMapLayer,
        mapMarkerLayer
      ],
      view: mapView
    });
  }

  ngOnInit(): void {
    this.updateClientSelectItems();
  }

  ngAfterViewInit() {
    this._mainMap.setTarget(this.mainMapElem.nativeElement);

    this.utilsService.addResizeListener(
      this.mainMapElem.nativeElement,
      () => {
        this._mainMap.updateSize();
      }
    );

    this.apiService.addLogListener('main', (clientId, spabLog) => {
      this.renderLog(clientId, spabLog);
    });

    this.apiService.addStatusListener('main', () => {
      this.updateClientSelectItems();
    });

    this.apiService.addClientStatusListener('main', () => {
      this.updateClientSelectItems();
    });

    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.removeCamResizeListeners();
    this.utilsService.removeResizeListener(
      this.mainMapElem.nativeElement
    );
    this.apiService.removeLogListener('main');
  }

  toggleCamFullscreen(evt: MouseEvent) {
    let camContainer = (evt.target as HTMLElement)?.parentElement?.parentElement;

    if (!camContainer) {
      return;
    }

    if (camContainer.classList.contains('camera-fs')) {
      camContainer.classList.add('border');
      camContainer.classList.remove('camera-fs');
    } else {
      camContainer.classList.remove('border');
      camContainer.classList.add('camera-fs');
    }
  }

  updateClientSelectItems() {
    let items: {
      selected: boolean,
      text: string,
      clientId: string
    }[] = [{
      selected: true,
      text: 'Disconnected',
      clientId: ''
    }];

    for (let client of this.apiService.clients) {
      let selected = this.apiService.subscribedClientIds.has(client.clientId);

      items.push({
        selected: selected,
        text: (client.connected ? '🟢' : '🔴') + ' ' + client.name,
        clientId: client.clientId
      });

      if (selected) {
        items[0].selected = false;
      }
    }

    this.clientSelectItems = items;
  }

  removeCamResizeListeners() {
    // remove resize listener
    if (this.clientCameras) {
      this.clientCameras.forEach((item) => {
        for (let child of item.nativeElement.children) {
          if (child.getAttribute('cam')) {
            this.utilsService.removeResizeListener(child);
          }
        }
      });
    }
  }

  renderLog(clientId: string, spabLog: SpabLog) {
    if (!(clientId === this._clientSelectValue)) {
      return;
    }

    if (spabLog.type === 'camera') {
      let camName = spabLog.typeId;
      this.cameraNames.add(camName);

      setTimeout(() => {
        let camContainer: HTMLElement | undefined;
        let camCanvas: HTMLCanvasElement | undefined;

        this.clientCameras.find((item) => {
          for (let child of item.nativeElement.children) {
            if (child.getAttribute('cam') === camName) {
              camContainer = item.nativeElement;
              camCanvas = child;
              return true;
            }
          }

          return false;
        });

        if (!camCanvas) {
          return;
        }

        let img = new Image();
        img.onload = () => {
          this.utilsService.imgToCanvas(camCanvas!, img);

          this.utilsService.addResizeListener(camContainer!, () => {
            this.utilsService.imgToCanvas(camCanvas!, img);
          });
        }
        img.src = URL.createObjectURL(new Blob([spabLog.obj.buf], {type: 'image/jpg'}));
      }, 1);
    }
  }
}
