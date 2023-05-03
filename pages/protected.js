import Cookies from 'cookies'
import LitJsSdk from 'lit-js-sdk'
import React, { useEffect, useState } from 'react';
import {
  Scene,
  Box,
  Sphere,
  Cylinder,
  Plane,
  Sky,
} from '@belivvr/aframe-react';



export default function Protected(props) {
  const [rendered, setRendered] = useState(false)
  
  if (!props.authorized) {
    return (
      <h2>Unauthorized</h2>
    )
  }

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe'); // eslint-disable-line global-require
    }
  }, [setRendered]);
  
  if (!rendered) {
    return <>loading</>;
  }
  
  return (
    <Scene>
      <Box
        position={{ x: -1, y: 0.5, z: -3 }}
        rotation={{ x: 0, y: 45, z: 0 }}
        color="#4CC3D9"
      />
      <Sphere
        position={{ x: 0, y: 1.25, z: -5 }}
        radius={1.25}
        color="#EF2D5E"
      />
      <Cylinder
        position={{ x: 1, y: 0.75, z: -3 }}
        radius={0.5}
        height={1.5}
        color="#FFC65D"
      />
      <Plane
        position={{ x: 0, y: 0, z: -4 }}
        rotation={{ x: -90, y: 0, z: 0 }}
        width={4}
        height={4}
        color="#7BC8A4"
      />
      <Sky color="#ECECEC" />
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