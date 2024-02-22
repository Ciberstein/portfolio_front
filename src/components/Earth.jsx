
import React, { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl';
import { useSelector } from 'react-redux';
import * as THREE from 'three';

const polygonsMaterial = new THREE.MeshLambertMaterial({ color: 'darkslategrey', side: THREE.DoubleSide });

export const Earth = () => {

    const globeEl = useRef();

    const [landPolygons, setLandPolygons] = useState([]);

    const darkMode = useSelector((state) => state.darkMode);


    useEffect(() => {
        const globe = globeEl.current;
        // Auto-rotate
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.8;
    }, []);

    useEffect(() => {
        // load data
        fetch('//unpkg.com/world-atlas/land-110m.json').then(res => res.json())
          .then(landTopo => {
            setLandPolygons(topojson.feature(landTopo, landTopo.objects.land).features);
          });
      }, []);

    return (
        <Globe
            ref={globeEl}
            backgroundColor="rgba(0,0,0,0)"
            showGlobe={true}
            showAtmosphere={false}
            polygonsData={darkMode ? landPolygons : [] }
            polygonCapMaterial={polygonsMaterial}
            globeImageUrl={`//unpkg.com/three-globe/example/img/${darkMode ? "earth-dark.jpg" : "earth-blue-marble.jpg"}`}
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            polygonSideColor={() => darkMode ? '#00ffff' : 'rgba(0,0,0,0)'}
            width={600}
            height={750}
        />
    )
}
