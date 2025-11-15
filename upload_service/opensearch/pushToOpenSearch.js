// upload service - opensearch/pushToOpenSearch.js

import { Client } from "@opensearch-project/opensearch";
import aws4 from "aws4";
import AWS from "aws-sdk";

const PushToOpenSearch =  async (id ,title, filename ,description, author, videoUrl) => {
   try {

       console.log('Pushing to Open Search');
       // Process video upload and extract metadata
    //    var auth = "HHLDisawesome1!"; // For testing only. Don't store credentials in code.
       var host = "";
       var host_aiven = process.env.AIVEN_OPENSEARCH;
      
       var client = new Client({
           node: host_aiven
       });

       var index_name = "video";
       var document = {
           id: id,
           title: title,
           filename: filename,
           author: author,
           description: description,
           videoUrl: videoUrl
       };

       var response = await client.index({
           id: id, // id should ideally be db id
           index: index_name,
           body: document,
           refresh: true,
       });
       console.log("Adding document:");
       console.log(response.body);
      
   } catch (error) {
       // Respond with error message
       console.log(error.message)
   }
};
export default PushToOpenSearch;

