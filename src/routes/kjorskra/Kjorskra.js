// @flow

import React, { PureComponent, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Kjorskra.scss';
import busData from './bus.json';
import BusPlanner from './components/BusPlanner';
import TaxiPlanner from './components/TaxiPlanner';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';

const Map = withScriptjs(
  withGoogleMap(({ mapOptions, kjorstadur }) => {
    return (
      <GoogleMap defaultZoom={mapOptions.zoom} center={mapOptions.center}>
        <Marker position={mapOptions.center}>
          <InfoWindow>
            <div>
              Kjörstaðurinn þinn er <b>{kjorstadur}</b>
            </div>
          </InfoWindow>
        </Marker>
      </GoogleMap>
    );
  })
);

class Kjorskra extends PureComponent {
  static contextTypes = {
    fetch: PropTypes.func.isRequired
  };
  state = {
    kennitala: '',
    data: null,
    isFetching: false,
    mapOptions: {
      zoom: 13,
      center: { lat: 65.7, lng: -19.6 }
    },
    currentAddress: null,
    currentAddressInput: '',
    driving: null,
    walking: null,
    bicycling: null
  };
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.submit = this.submit.bind(this);
    this.submitCurrentAddress = this.submitCurrentAddress.bind(this);

    setTimeout(() => {}, 3000);
  }
  componentWillMount() {
    // if (__DEV__) {
    //   // To test
    //   this.setState({
    //     mapOptions: {
    //       zoom: 13,
    //       center: { lat: 64.1163028, lng: -21.7996805 }
    //     },
    //     data: {
    //       success: true,
    //       kennitala: '1234567890',
    //       nafn: 'Kristján Ingi Mikaelsson',
    //       logheimili: 'Melbær 14',
    //       kjordaemi: 'Reykjavíkurkjördæmi suður',
    //       sveitafelag: 'Reykjavík',
    //       kjorstadur: 'Árbæjarskóli',
    //       kjordeild: '5'
    //     }
    //   });
    // }
  }
  async getDistance({ from, to, mode }) {
    if (!process.env.BROWSER) return { distance: null, duration: null };
    return new Promise(resolve => {
      new window.google.maps.DistanceMatrixService().getDistanceMatrix(
        {
          origins: ['austurbrun 2'],
          destinations: ['arbaejarskoli'],
          travelMode: mode //BICYCLING,WALKING,DRIVING
        },
        results => {
          if (results.rows.length === 0) {
            console.error('No results from distance matrix');
            return;
          }

          let distance = null;
          let duration = null;

          results.rows.forEach(row => {
            row.elements.forEach(element => {
              if (element && element.distance) {
                distance = element.distance.value;
              }
              if (element && element.duration) {
                duration = element.duration.value;
              }
            });
          });

          resolve({
            distance,
            duration
          });
        }
      );
    });
  }
  async locationFromAddress(address) {
    if (!process.env.BROWSER) return this.state.mapOptions.center;

    // const distance = await this.getDistance({
    //   from: 'Austurbrun 2',
    //   to: 'Arbaejarskoli',
    //   mode: 'DRIVING'
    // });
    //
    // console.log('what is distance result', distance);

    return new Promise(resolve => {
      new window.google.maps.Geocoder().geocode(
        {
          address
        },
        (results, status) => {
          if (results.length === 0) {
            return resolve({
              invalidLocation: true
            });
          }
          console.log('here', results[0]);
          resolve({
            center: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            }
          });
        }
      );
    });
  }
  onInputChange(type, e) {
    this.setState({
      [type]: e.target.value
    });
  }
  async submit() {
    console.log('doing submit');
    const { kennitala } = this.state;

    this.setState({
      isFetching: true
    });

    let data;

    try {
      const response = await this.context.fetch(
        `https://kjorskra.kjosturett.is/leita/${kennitala}`
      );
      data = await response.json();
    } catch (e) {
      //@TODO handle
      console.error(e);

      this.setState({
        isFetching: false
      });
      return;
    }

    this.setState({
      isFetching: false,
      data
    });

    setTimeout(async () => {
      const options = await this.locationFromAddress(data.kjorstadur);

      this.setState({
        mapOptions: {
          zoom: 13,
          ...options
        }
      });
    }, 400);
  }
  async submitCurrentAddress() {
    console.log('submit');
    const { currentAddressInput, mapOptions } = this.state;

    const location = await this.locationFromAddress(currentAddressInput);

    const position = {
      from: new window.google.maps.LatLng(
        location.center.lat,
        location.center.lng
      ),
      to: new window.google.maps.LatLng(
        mapOptions.center.lat,
        mapOptions.center.lng
      )
    };

    const walkingPromise = this.getDistance({
      ...position,
      mode: 'WALKING'
    });

    const bicyclingPromise = this.getDistance({
      ...position,
      mode: 'BICYCLING'
    });

    const drivingPromise = this.getDistance({
      ...position,
      mode: 'DRIVING'
    });

    const [walking, bicycling, driving] = await Promise.all([
      walkingPromise,
      bicyclingPromise,
      drivingPromise
    ]);

    console.log('what is location', location);
    console.log('what is walking', walking);
    console.log('what is bicycling', bicycling);
    console.log('what is driving', driving);

    this.setState({
      currentAddress: location.center,
      driving: driving,
      walking: walking,
      bicycling: bicycling
    });
  }
  render() {
    const {
      kennitala,
      data,
      isFetching,
      mapOptions,
      currentAddress,
      currentAddressInput,
      walking,
      driving,
      bicycling
    } = this.state;

    return (
      <div className={s.root}>
        {!data && (
          <div className={s.lookupContainer}>
            <input
              value={kennitala}
              type="text"
              placeholder="Settu inn kennitöluna þína"
              className={s.input}
              onChange={e => this.onInputChange('kennitala', e)}
            />
            <div onClick={this.submit} className={s.submit}>
              Fletta upp
            </div>
          </div>
        )}
        {data && (
          <div className={s.results}>
            <div>
              <p>
                Hæ, {data.nafn}. Þú ert í <b>kjördeild</b>{' '}
                <i>{data.kjordeild}</i> og <b>kjörstaðurinn</b> þinn er{' '}
                <i>{data.kjorstadur}</i>, <i>{data.sveitafelag}</i>. Þú greiðir
                atkvæði í <b>kjördæminu</b> <i>{data.kjordaemi}</i>.
              </p>
              {!currentAddress && (
                <div>
                  <h3>Nú þurfum við bara að koma þér á kjörstað!</h3>
                  <div className={s.currentAddressContainer}>
                    <input
                      value={currentAddressInput}
                      type="text"
                      placeholder="Hvar ert þú núna?"
                      className={s.input}
                      onChange={e =>
                        this.onInputChange('currentAddressInput', e)}
                    />
                    <div
                      onClick={this.submitCurrentAddress}
                      className={s.submit}
                    >
                      Áfram
                    </div>
                  </div>
                </div>
              )}
              {currentAddress && (
                <div>
                  {walking.duration && (
                    <p>
                      Það tekur þig {Math.ceil(walking.duration / 60)} mínútur
                      að labba {(walking.distance / 1000).toFixed(1)} km. á
                      kjörstað
                    </p>
                  )}
                  {bicycling.duration && (
                    <p>
                      Það tekur þig {Math.ceil(bicycling.duration / 60)} mínútur
                      að hjóla {(bicycling.distance / 1000).toFixed(1)} km. á
                      kjörstað
                    </p>
                  )}
                  {driving.duration && (
                    <p>
                      Það tekur þig {Math.ceil(driving.duration / 60)} mínútur
                      að keyra {(driving.distance / 1000).toFixed(1)} km. á
                      kjörstað
                    </p>
                  )}
                  <TaxiPlanner />
                  <BusPlanner from={mapOptions.center} to={currentAddress} />
                </div>
              )}
            </div>

            {mapOptions.invalidLocation && <div>INVALIDLOCATION</div>}

            {!mapOptions.invalidLocation && (
              <div className={s.mapContainer}>
                <Map
                  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDJ6iS5zhPH3xJQM6WPlx5YvgHSvgA3Ceo&libraries=geometry,drawing,places"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: '100%', width: '100%' }} />}
                  mapOptions={mapOptions}
                  kjorstadur={data.kjorstadur}
                />
              </div>
            )}
          </div>
        )}
        {isFetching && <div>Næ í gögn</div>}

        <p className={s.disclaimer}>
          Uppflettingar eru gerðar í Kjörskrá. Gögn eru ekki geymd.
        </p>
      </div>
    );
  }
}

export default withStyles(s)(Kjorskra);
