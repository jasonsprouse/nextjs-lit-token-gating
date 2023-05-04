import Cookies from 'cookies'
import LitJsSdk from 'lit-js-sdk'
import React, { useEffect, useState } from 'react';
import {
  Scene,
  Light,
  Entity,
  Assets,
  AssetItem,
  GLTFModel,
  Box,
  Sphere,
  Cylinder,
  Plane,
  Sky,
} from '@belivvr/aframe-react';



export default function Protected(props) {
  const [rendered, setRendered] = useState(false);
  const [aframeLoaded, setAframeLoaded] = useState(false);

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe'); // eslint-disable-line global-require
      setAframeLoaded(true);
    }
  }, []);

  if (!props.authorized) {
    return <h2>Unauthorized</h2>;
  }

  if (!rendered || !aframeLoaded) {
    return <>loading</>;
  }
  
  return (
    <Scene>
        <Sky src="https://cdn.glitch.com/b870d9ec-1139-44f9-b462-223e4a2c74e7%2Fsechelt.jpg?1490307995926" radius="30" />
        <Light type="ambient" color="#666" />
        <Light type="point" intensity="2" position="2 4 4" />
    </Scene>
  );
}

export async function getServerSideProps({ req, res, query }) {
  const { id } = query
  const cookies = new Cookies(req, res)
  const jwt = cookies.get('lit-auth')

  if (!jwt) {
    return {
      props: {
        authorized: false
      },
    }
  }

  const { verified, payload } = LitJsSdk.verifyJwt({ jwt })

  if (
    payload.baseUrl !== "http://localhost:3000"
    || payload.path !== '/protected'
    || payload.extraData !== id
  ) {
    return {
      props: {
        authorized: false
      },
    }
  }
  return {
    props: {
      authorized: verified ? true : false
    },
  }
}