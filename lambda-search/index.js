import express from "express";
import {Client} from "@opensearch-project/opensearch";
import serverless from "serverless-http";

const app = express();

// const host_aiven = process.env.AIVEN_OPENSEARCH;
const host_aiven = "";
if (!host_aiven) {
  console.warn("WARNING: AIVEN_OPENSEARCH env var is not set");
}


const client = new Client({
  node: host_aiven,
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    return res.status(200).send("OK");
  }
  next();
});

// GET /search?q=term
app.get("/search", async (req, res) => {
  try {
    console.log("Inside /search handler");

    const searchTerm = req.query.q || "";
    console.log("search term is", searchTerm);

    const { body } = await client.search({
      index: "video",
      body: {
        query: {
          simple_query_string: {
            query: searchTerm,
            fields: ["title", "filename", "author", "description", "videoUrl"],
          },
        },
      },
    });

    const hits = body.hits.hits;
    console.log("Search hits:", hits.length);

    res.status(200).json(hits);
  } catch (error) {
    console.error("Error in /search:", error);
    res.status(500).json({ message: "Internal Server 1 Error", error : error });
  }
});

// Wrap into Lambda handler
export const handler = serverless(app);
