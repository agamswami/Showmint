"use client"
import React, { useEffect, useState } from 'react';
import axios from "axios"
import dynamic from 'next/dynamic'
import NavBar from '../components/navbar';
import { useVideosStore } from '../zustand/useVideosStore'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const YouTubeHome = () => {
   const [videos, setVideos] = useState([]);
   const [loading, setLoading] = useState(true);
   const { searchedVideos } = useVideosStore();

   useEffect(() => {
       const getVideos = async () => {
           try {
            //    const cloudFrontURl = await axios.get('http://localhost:8082/') 
               const res = await axios.get('http://localhost:8082/watch/home');
            //    const res = await axios.get(`${process.env.NEXT_PUBLIC_CDF_URL}/hls/`);

               console.log(res);
            //    const generateSignedURL = async (video) => {
            //         video.signedURl = await axios.get(`http://localhost:8082/watch/key=${}`)
            //         console.log("signed url" , video.signedURl);
            //    }

                const genrateCDF_URL = (video) => {
                    video.CDF_URL = `${process.env.NEXT_PUBLIC_CDF_URL}/hls/${video.filename.replace(
        '.',
        '_'
    )}_master.m3u8`
                    return video;
                } 

                const withCDF_URL = res.data.map(genrateCDF_URL);
                // setVideos(res.data);
                setVideos(withCDF_URL);
                console.log(videos);

                setLoading(false); // Set loading to false when videos are fetched
           } catch (error) {
               console.log('Error in fetching videos : ', error);
               setLoading(false);
           }
       }
       getVideos();
       

       

   }, []);

   const dataToShow = searchedVideos && searchedVideos.length > 0 ? searchedVideos : videos;


   return (
       <div>
            <NavBar/>
           {loading ? (
               <div className='container mx-auto flex justify-center items-center h-screen'>Loading...</div>
           ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-10">
                   {dataToShow.map(video => (
                       <div key={searchedVideos && searchedVideos.length > 0 ? video._source.id : video.id}
                           className="border rounded-md overflow-hidden">
                           <div>
                               <ReactPlayer url={ searchedVideos && searchedVideos.length > 0 ? video._source.videoUrl : video.CDF_URL}
                                   width="100%"
                                   height="100%"
                                   controls={true}
                               />
                           </div>
                           <div className="p-4">
                               <h2 className="text-lg font-semibold mb-2">{searchedVideos && searchedVideos.length > 0 ? video._source.title : video.title}</h2>
                               <p className="text-gray-700">Author - {searchedVideos && searchedVideos.length > 0 ? video._source.author : video.author}</p>
                               <p className="text-gray-700">{searchedVideos && searchedVideos.length > 0 ? video._source.description : video.description}</p>
                           </div>
                       </div>
                   ))}
               </div>
           )}
       </div>
   );
};

export default YouTubeHome;
