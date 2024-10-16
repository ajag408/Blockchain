"use client";

import { NFTCard } from "../../components/nftCard";
import { Pagination } from "../../components/Pagination";
import { useState, useEffect } from "react";

export default function Home() {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [currentRecords, setCurrentRecords] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  // User is currently on this page
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(100);
  const [nPages, setNPages] = useState(1);

  const fetchNFTs = async () => {
    var nfts;
    console.log("fetching nfts");
    const api_key = "YtUZdfx9w_1z7f1pIvQSP3KKbQr5rETI";
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
      // console.log("data: ", nfts.totalCount);
      if (nfts.totalCount > 100) {
        var totalPages = Math.ceil(nfts.totalCount / 100);
        var pageKey = nfts.pageKey;
        for (var i = 0; i < totalPages - 1; i++) {
          var thisFetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}`;
          var new_nfts = await fetch(thisFetchURL, requestOptions).then(
            (data) => data.json()
          );
          // console.log("new_nfts: ", new_nfts);
          nfts.ownedNfts = nfts.ownedNfts.concat(new_nfts.ownedNfts);
          // console.log("new length: ", nfts.ownedNfts.length);
          if (new_nfts.pageKey) {
            pageKey = new_nfts.pageKey;
          }
        }
      }
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
      if (nfts.totalCount > 100) {
        var totalPages = Math.ceil(nfts.totalCount / 100);
        var pageKey = nfts.pageKey;
        for (var i = 0; i < totalPages - 1; i++) {
          var thisFetchURL = `${baseURL}?owner=${wallet}&pageKey=${pageKey}&contractAddresses%5B%5D=${collection}`;
          var new_nfts = await fetch(thisFetchURL, requestOptions).then(
            (data) => data.json()
          );
          // console.log("new_nfts: ", new_nfts);
          nfts.ownedNfts = nfts.ownedNfts.concat(new_nfts.ownedNfts);
          // console.log("new length: ", nfts.ownedNfts.length);
          if (new_nfts.pageKey) {
            pageKey = new_nfts.pageKey;
          }
        }
      }
    }

    if (nfts) {
      setNFTs(nfts.ownedNfts);
      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = nfts.ownedNfts.slice(
        indexOfFirstRecord,
        indexOfLastRecord
      );

      // console.log("current records: ", currentRecords);
      const numPages = Math.ceil(nfts.ownedNfts.length / recordsPerPage);
      setNPages(numPages);
      setCurrentRecords(currentRecords);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = "YtUZdfx9w_1z7f1pIvQSP3KKbQr5rETI";
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }
    }
  };

  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    console.log("first: ", indexOfFirstRecord);
    console.log("last: ", indexOfLastRecord);
    const currentRecords = NFTs.slice(indexOfFirstRecord, indexOfLastRecord);
    setCurrentRecords(currentRecords);
  }, [currentPage]);

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchForCollection}
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder="Add your wallet address"
        ></input>
        <input
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>

        <label className="text-gray-600 ">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else fetchNFTs();
          }}
        >
          Let's go!{" "}
        </button>
      </div>
      <div>
        <Pagination
          nPages={nPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {"currentPage" + currentPage}
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {currentRecords.length &&
          currentRecords.map((nft) => {
            return <NFTCard nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
}
