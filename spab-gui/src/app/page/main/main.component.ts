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
import { fromLonLat } from 'ol/proj';

import olSourceVector from 'ol/source/Vector';
import {
  default as olSourceOSM,
  ATTRIBUTION as olSourceOSMAttribution
} from 'ol/source/OSM';

import {
  default as olSourceXYZ
} from 'ol/source/XYZ';

import {
  Attribution as olControlAttribution,
  FullScreen as olControlFullScreen,
  defaults as olControlDefaultControls
} from 'ol/control';
import { ApiService, SpabClientSummary, SpabLog } from 'src/app/service/api.service';
import { UtilsService } from 'src/app/service/utils.service';
import Geometry from 'ol/geom/Geometry';



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
  private _clientFeature: olFeature<Geometry>;
  private _initZoomSet = false;
  private _mainMapView: olView;

  clientSelectItems: {
    selected: boolean,
    text: string,
    clientId: string
  }[] = [];

  selectedClient: SpabClientSummary | undefined;
  cameraNames = new Set<string>();
  sensorDataMap = new Map<string, any>();


  private _clientSelectValue: string = '';

  private _logSelectedTimestamp: number = 0;
  logStartTimestamp: number = 0;
  logEndTimestamp: number = 0;
  private _logSliderTimer: any;


  get clientSelectValue() {
    return this._clientSelectValue;
  }

  set clientSelectValue(clientId: string) {
    this._clientSelectValue = clientId;

    setTimeout(async () => {
      this.removeCamResizeListeners();
      this.cameraNames = new Set<string>();
      this.sensorDataMap = new Map<string, any>();

      await this.apiService.unsubscribeAll();

      if (this._logSliderTimer) {
        clearTimeout(this._logSliderTimer);
      }

      if (clientId !== '') {
        this.selectedClient = this.apiService.getClient(clientId);

        await this.apiService.subscribe(clientId);

        if (this.selectedClient) {
          this.logStartTimestamp = Math.round(this.selectedClient.logStartTimestamp / 1000);
          this.logEndTimestamp = Math.round(this.selectedClient.logEndTimestamp / 1000);
          this._logSelectedTimestamp = this.logEndTimestamp;

          for (let spabLog of this.selectedClient.latestLogs) {
            this.renderLog(clientId, spabLog, true);
          }
        }
      } else {
        this.selectedClient = undefined;
      }
    }, 0);
  }

  get logSelectedTimestamp() {
    return this._logSelectedTimestamp;
  }

  set logSelectedTimestamp(logSelectedTimestamp: number) {
    if (this.selectedClient) {
      this.cameraNames = new Set<string>();
      this.sensorDataMap = new Map<string, any>();
      this._logSelectedTimestamp = logSelectedTimestamp;

      if (this._logSelectedTimestamp === this.logEndTimestamp) {
        for (let spabLog of this.selectedClient.latestLogs) {
          this.renderLog(this.selectedClient.clientId, spabLog, true);
        }
      } else {
        if (this._logSliderTimer) {
          clearTimeout(this._logSliderTimer);
        }

        this._logSliderTimer = setTimeout(async () => {
          if (this.selectedClient) {
            await this.apiService.getLogs(this.selectedClient.clientId, this._logSelectedTimestamp * 1000);
          }
          this._logSliderTimer = null;
        }, 50);
      }
    }
  }


  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    let initPosSet = false;
    let currentPos: Coordinate | undefined = [0, 0];

    this._mainMapView = new olView({
      center: [0, 0],
      zoom: 1,
    });

    // current position marker
    this._clientFeature = new olFeature();
    this._clientFeature.setStyle(
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

    let mapMarkerLayer = new olLayerVector({
      source: new olSourceVector({
        features: [this._clientFeature],
      })
    });

    // 'Powered by Esri', 'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
    // '© <a href="http://www.openseamap.org/">OpenSeaMap</a> contributors.',

    let esriSatelliteLayer = new olLayerTile({
      source: new olSourceXYZ({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 20
      })
    });

    let openSeaMapLayer = new olLayerTile({
      source: new olSourceOSM({
        opaque: false,
        url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
      })
    });

    this._mainMap = new olMap({
      controls: [],
      layers: [
        esriSatelliteLayer,
        openSeaMapLayer,
        mapMarkerLayer
      ],
      view: this._mainMapView
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

    this.apiService.addLogListener('main', (clientId, spabLog, latest) => {
      if (this.selectedClient) {

        if (latest) {
          if (this.logEndTimestamp === this._logSelectedTimestamp) {
            this.renderLog(clientId, spabLog, latest);
            this._logSelectedTimestamp = Math.round(this.selectedClient.logEndTimestamp / 1000);
          }
        } else {
          this.renderLog(clientId, spabLog, latest);
        }

        this.logStartTimestamp = Math.round(this.selectedClient.logStartTimestamp / 1000);
        this.logEndTimestamp = Math.round(this.selectedClient.logEndTimestamp / 1000);
      }
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

  renderLog(clientId: string, spabLog: SpabLog, latest: boolean) {
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
        img.src = URL.createObjectURL(new Blob([spabLog.data], {type: 'image/jpg'}));
      }, 1);
    } else if (spabLog.type === 'sensor') {
      try {
        let dataJson = new TextDecoder().decode(spabLog.data);
        let data = JSON.parse(dataJson);
        this.sensorDataMap.set(spabLog.typeId, data);

        if (spabLog.typeId === 'GLOBAL_POSITION_INT') {
          let geo = new Point(fromLonLat([parseFloat(data.lon) / 1e7, parseFloat(data.lat) / 1e7]));

          this._clientFeature.setGeometry(geo);

          if (!this._initZoomSet) {
            this._mainMapView.fit(geo, {
              maxZoom: 12
            });
            this._initZoomSet = true;
          }
        }
      } catch(e) { }
    }
  }
}
