"use client"
import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';


const VideoPlayer = (HLS_url , main_url) => {
   const videoRef = useRef(null);
   const hlsSrc = HLS_url;
   const mainSrc = HLS_url;

   useEffect(() => {
       const video = videoRef.current;

       if (Hls.isSupported()) {
           console.log("HLS is supported");
               console.log(HLS_url);
               const hls = new Hls();
               hls.attachMedia(video);
               hls.loadSource(HLS_url);
               hls.on(Hls.Events.MANIFEST_PARSED, function () {
                   console.log("playing video");
                   video.play();
               });
       } else {
           console.log('HLS is not supported');
           // Play from the original video file   
       }
   }, [ hlsSrc, mainSrc]);

   return <video ref={videoRef} controls />;
};

export default VideoPlayer;


