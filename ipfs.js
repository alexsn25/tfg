import { create, CID, IPFSHTTPClient } from "ipfs-http-client";

const projectId = "2ERh3HXs5FJQVayQHAQwVTNzwrx";
const projectSecret = "dcdff293d54f8ea0ca2a61b0f99e1641";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers:{
      authorization
    }
  });

  export default ipfs;