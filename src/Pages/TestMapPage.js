import React, { Component, useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import userEvent from '@testing-library/user-event';
import moment from 'moment'
import { Select, InputNumber } from 'antd';

import MapboxDraw from '@mapbox/mapbox-gl-draw'
//mapboxgl.accessToken = 'pk.eyJ1Ijoic3dhbGxvd2RyYWdvbiIsImEiOiJja2k0NGN1N3AzN3dmMnlwNThxNzRrc2ZnIn0.pgGEJpmH0282Q-TUjMHAtw';
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
const { Option } = Select;
function TestMapPage() {

    const [state, setState] = useState({
        mapInfo: undefined,
        zoom: 1,
        selFloorId: [],
        floorList: [],
        lat: undefined,
        lng: undefined
    })
    //const url = 'https://test-easy.mall-to.com';
    const url = 'https://integration-easy.mall-to.com';
    const getFloorIdList = () => {
        fetch(url + "/api/floor", {
            headers: {
                'content-type': 'application/json',
                'UUID': '1008',
                'App-Id': '999',
                'Timestamp': moment().format("YYYY-MM-DD hh:mm:ss"),
                'Accept': 'application/json',
                'Signature-Version': '999'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
        })
            .then((res) => {
                const response = res.json();
                response.then((data) => {
                    console.log(data)
                    state.floorList = data;
                    if (data.length > 0) {
                        state.selFloorId = data[0].id
                        getMapInfo(data[0].id)
                    }
                    setState({ ...state })
                })
            })
            .catch((e) => {
                console.log(e);
                state.result = e;
                setState({ ...state })
            });
    }

    const getMapInfo = (id) => {
        fetch(url + "/api/map_data/floor_index?floor_id=" + id, {
            headers: {
                'content-type': 'application/json',
                'UUID': '1008',
                'App-Id': '999',
                'Timestamp': moment().format("YYYY-MM-DD hh:mm:ss"),
                'Accept': 'application/json',
                'Signature-Version': '999'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
        })
            .then((res) => {
                const response = res.json();
                response.then((data) => {
                    let mapInfo = data;
                    state.mapInfo = data;
                    mapInfo.zoom = 18.2;
                    state.zoom = mapInfo.zoom;
                    console.log(data)
                    console.log('set style')
                    map.current.setStyle(mapInfo);
                    addHeatMap();
                    setState({ ...state })
                })
            })
            .catch((e) => {
                console.log(e);
                state.result = e;
                setState({ ...state })
            });
    }

    const init = useRef(false)
    const map = useRef({});

    useEffect(() => {
        if (init.current)
            return;
        getFloorIdList();
        init.current = true;


        //??????????????????
        let bounds = [
            [118.21, 28.11], // Southwest coordinates???????????????
            [122.40, 31.33]  // Northeast coordinates???????????????
        ];

        map.current = new mapboxgl.Map({
            container: 'map',

        });
        //?????????????????????
        var nav = new mapboxgl.NavigationControl(
            {
                //???????????????????????????????????????true
                "showCompass": true,
                //????????????????????????????????????true
                "showZoom": true
            }
        );
        //??????????????????????????????????????????'top-left', 'top-right','bottom-left' ,'bottom-right'??????????????????'top-right'
        map.current.addControl(nav, 'top-right');

        var Draw = new MapboxDraw({
            //?????????????????????????????????
            keybindings: false,
            //?????????ture????????????shift+?????????????????????
            boxSelect: true,
            //????????????????????????????????????????????????
            clickBuffer: 5,
            //??????????????????????????????????????????true????????????????????????????????????
            displayControlsDefault: false,
            //???????????????????????????
            controls: {
                //???????????????
                line_string: false,
                //?????????????????????
                polygon: true,
                //???????????????
                point: false,
                //??????????????????
                trash: true
            }
        });

        map.current.on('draw.create', getGeometryInfo);
        map.current.addControl(Draw, 'top-left');
        addPolygon();

        // map.current.on('mousemove', showLngLat );
        map.current.on('zoom', function (e) {
            state.zoom = map.current.getZoom();
            setState({...state})
        })
    }, [init.current])

    const showLngLat = useCallback((e) => {
        state.lng = e.lngLat.lng.toFixed(5);
        state.lat = e.lngLat.lat.toFixed(5);
        setState({ ...state })
    }, [state])


    const heatData = {
        "type": "FeatureCollection",
        "features": [
            {
                "geometry": {
                    "coordinates": [
                        114.07044, 22.53470
                    ],
                    "type": "Point"
                },
                "type": "Feature",
                "properties": {
                    "new_recovery": 3,
                    "new_death": 0,
                    "new_diagnosis": 10
                }
            },
            {
                "geometry": {
                    "coordinates": [
                        114.07045, 22.53469
                    ],
                    "type": "Point"
                },
                "type": "Feature",
                "properties": {
                    "new_recovery": 3,
                    "new_death": 0,
                    "new_diagnosis": 10
                }
            }]
    }

    const isAddHeatMap = useRef(false)
    const addHeatMap = () => {
        if (!map.current)
            return;

        map.current.on('styledata', function () {
            if (isAddHeatMap.current)
                return;
            isAddHeatMap.current = true;
            console.log('map add heatmap')
            // Add a geojson point source.
            // Heatmap layers also work with a vector tile source.
            map.current.addSource('virus-source', {
                "type": "geojson",
                "data": heatData
            });
            // ?????????????????????
            map.current.addLayer(
                {
                    id: "virus-heatmap",
                    type: "heatmap",
                    source: "virus-source",
                    paint: {
                        // ??????new_diagnosis??????
                        "heatmap-weight": [
                            "interpolate",
                            ["linear"],
                            ["get", "new_diagnosis"],
                            0,
                            0,
                            10,
                            1
                        ],
                        "heatmap-intensity": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            0,
                            1,
                            20,
                            1
                        ],
                        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                        // Begin color ramp at 0-stop with a 0-transparancy color
                        // to create a blur-like effect.
                        "heatmap-color": [
                            "interpolate",
                            ["linear"],
                            ["heatmap-density"],
                            0,
                            "rgba(0, 0, 0, 0)",
                            0.5,
                            "yellow",
                            1,
                            "red"
                        ],
                        // Adjust the heatmap radius by zoom level
                        "heatmap-radius": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            10,
                            1,
                            11,
                            1,
                            12,
                            1,
                            13,
                            1,
                            14,
                            1,
                            15,
                            2,
                            16,
                            4,
                            17,
                            8,
                            18,
                            16,
                            19,
                            32
                        ],
                        // Transition from heatmap to circle layer by zoom level
                        "heatmap-opacity": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            1,
                            0,
                            20,
                            1
                        ]
                    }
                }
            );
        })

    }


    /**?????????????????????????????????
      */
    const addPolygon = () => {
        //???geojson?????????????????????
        var geometryPolygon = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[100, 40], [110, 40], [115, 35], [110, 30], [100, 30], [95, 35]]]
                }
            }]
        };
        //?????????????????????????????????????????????????????????
        map.current.addLayer({
            //???id?????????????????????????????????
            "id": "Polygon",
            //???????????????fill??????????????????
            "type": "fill",
            //??????????????????
            "source": {
                "type": "geojson",
                "data": geometryPolygon
            },
            //??????????????????
            "paint": {
                //??????????????????
                "fill-color": '#ffcc33',
                //???????????????
                "fill-opacity": 0.9
            }
        });
    }

    const floorChange = (value) => {
        state.selFloorId = value;
        getMapInfo(value)
        setState({ ...state })
    }

    function getGeometryInfo(e) {
        //?????????????????????
        var type = e.features[0].geometry.type;
        //????????????
        switch (type) {
            //?????????   
            case 'Point':
                //???????????????
                var points = e.features[0].geometry.coordinates;
            case 'Polygon':
                //????????????????????????????????????
                var coordinates = e.features[0].geometry.coordinates[0];
                var count = coordinates.length;
                for (var i = 0; i < count; i++) {
                    //???????????????
                    var points = coordinates[i];
                    console.log(points)
                }

        }
    }


    return <div >
        <Select style={{ width: '80px' }} onChange={floorChange} value={state.selFloorId}>
            {
                state.floorList.map((element, index) => {
                    return <Option value={element.id} key={element.id}>{element.name}</Option>
                })
            }
        </Select>
        <div>{state.zoom}</div>
        <div id="map" style={{ width: '1200px', height: '700px' }} ></div>
    </div>
}

export default TestMapPage;