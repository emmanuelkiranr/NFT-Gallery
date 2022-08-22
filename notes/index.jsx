import React, { useState } from "react";
import { NFTMapping } from "../components/NFTMapping";
import { Pagination } from "../components/Pagination";

const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // const [startToken, setStartToken] = useState("");
  const itemsPerPage = 15;

  // const handleNextPageCall = () => {
  //   const nextEndIndex = (currentPage + 1) * itemsPerPage; // (1 + 1) * 15 = 30
  //   setCurrentPage(currentPage + 1); // 2
  //   if (NFTs.length < nextEndIndex) {
  //     fetchImages();
  //   }
  // };
  // const handlePrevPageCall = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  const getPaginatedData = () => {
    const startIndex = currentPage * itemsPerPage - itemsPerPage; // 1 * 15 - 15 = 0
    const endIndex = startIndex + itemsPerPage; // 0 + 15 = 15

    console.log(NFTs);
    console.log(startIndex);
    console.log(endIndex);

    return NFTs.slice(startIndex, endIndex);
  };

  const fetchNFTs = async () => {
    let nfts; // The nfts will be into an array. So we create a state variable to store this array
    console.log("fetching nfts...");

    const api_key = "tHF0lIQAFOnA82CcEx3zAimW9cKAAliS";
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`; // getNFTs endpoint

    // check if we want to look for nfts owned by an address or filter by the collection
    if (!collection.length) {
      // if the collection doesn't contain any words aka the collectin address means we are filtering it with the address aka the wallet address

      /* Then we fetch the collection with the owner address using fetch() - helps us fetch resources from other sources in this case 
      the RESTful api. Inside fetch we have few paramaters*/

      var requestOptions = {
        // This will tell fetch() that our request will be a method GET
        method: "GET",
      };

      const fetchURL = `${baseURL}?owner=${wallet}`;

      //once we fetch() we do then(data => data.json) cause we get a string version of our data which we need to bring it back to json. So we use
      // json() which trasform json stringified data into actual json
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts of collection owned by an address");
      // fetch all nfts owned by wallet belonging to collection address
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log(nfts); // This returns us details of all the nfts like tokenURI, media and so on of that address
      setNFTs(nfts.ownedNfts); // Since we only need ownedNFTs from the json
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = "tHF0lIQAFOnA82CcEx3zAimW9cKAAliS";
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`; // getNFTsForCollection endpoint

      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${true}`;
      /* By setting withMetadata parameter to true it returns the nft metadata[like image attributes etc] else only the tokenIds.
      And we would need to use another endpoint for fetching the metadata ie getNFTMetadata which uses contractAddress and tokenId as parameters */

      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log("NFTs in collection", nfts);
        setNFTs(nfts.nfts); // cause we only need the nfts array from the json
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          disabled={fetchForCollection} // this field will be disabled if we are only fetching collection by setting the checked value to true
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type="text"
          placeholder="Enter your wallet address"
        />
        <br />
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type="text"
          placeholder="Enter the collection address"
        />
        <br />
        <label className="text-gray-600 ">
          <input
            className="mr-2"
            onChange={(e) => {
              setFetchForCollection(e.target.checked); // returns true of false based on checked or not
            }} // Now we need to check inside our button if this prop is true or false if true then on clicking button we need to execute fetchNFTsForCollection
            type="checkbox"
          />
          Fetch for collection
        </label>
        <br />
        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
          onClick={() => {
            fetchForCollection ? fetchNFTsForCollection() : fetchNFTs();
          }}
        >
          Submit
        </button>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        <>
          {NFTs.length ? (
            <>
              <NFTMapping nfts={getPaginatedData()} />
              <div>
                <PaginationBar>
                  <Pagination
                    handlePrevPageCall={handlePrevPageCall}
                    handleNextPageCall={handleNextPageCall}
                    page={currentPage}
                    items={itemsPerPage}
                  />
                  {/* handlePrevPageCall={handlePrevPageCall} */}
                  currentPage={currentPage}
                  {/* <Pagination handleNextPageCall={handleNextPageCall} /> */}
                  {/* handleNextPageCall={handleNextPageCall} */}
                </PaginationBar>
              </div>
            </>
          ) : null}
        </>
        {/* {
          // check if there is any NFT fetched using NFTs.length will return true if its value is more than 0
          // then render an nft card for every NFT fetched using mapping
          // Since NFTs is an array and arrays in js has this fn called map - The map fn perform some operation on every element of that array
          // every element of that array will be called nft so for every nft in the NFTs array run some operation
          NFTs.length &&
            NFTs.map((nft) => {
              return <NFTCard nft={getPaginatedData()}></NFTCard>;
              // we are passing the value nft (which is an element in the NFTs array) to object deconstruction {nft}
            })
        } */}
      </div>
    </div>
  );
};
const PaginationBar = ({
  handlePrevPageCall,
  currentPage,
  handleNextPageCall,
}) => (
  <div className="btn-container">
    <button onClick={handlePrevPageCall}>Previous Page</button>
    <div className={"current-page"}>Page {currentPage}</div>
    <button onClick={handleNextPageCall}>Next Page</button>
  </div>
);

export default Home;
