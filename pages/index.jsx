import { useState } from "react";
import { Card } from "../components/Card";

const home = () => {
  const [address, setAddress] = useState("");
  const [collection, setCollection] = useState("");
  const [check, setCheck] = useState(false);
  const [NFTs, setNfts] = useState([]); // since nfts fetched will be an array
  const [currentPage, setCurrentPage] = useState(0);
  const [pageKeys, setPageKeys] = useState([""]);

  const getNftsForOwner = async () => {
    let nfts;

    /* nfts = fetch(); needs fetch url and request option
    fetchURL needs base url and owner address
    baseURL = api endpoint */

    var requestOptions = {
      method: "GET",
    };

    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTs/`;

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${address}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      const fetchURL = `${baseURL}?owner=${address}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
      console.log(nfts);
    }
    if (nfts) {
      setNfts(nfts.ownedNfts);
    }
  };

  const getNftsForCollection = async (startToken = "", pageIndex = 0) => {
    // default parameter value
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_API_KEY}/getNFTsForCollection`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${true}&startToken=${startToken}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );

      if (nfts) {
        if (nfts.nextToken) {
          setPageKeys((prevKeys) => {
            const newKeys = [...prevKeys];
            newKeys[pageIndex + 1] = nfts.nextToken;
            return newKeys;
          });
        }
        console.log(nfts.nfts);
        setNfts(nfts.nfts);
      }
    }
  };

  const changePage = async (pageIndex) => {
    try {
      getNftsForCollection(pageKeys[pageIndex], pageIndex);
      setCurrentPage(pageIndex);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center py-8 gap-y-3">
        <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <input
            onChange={(event) => {
              setAddress(event.target.value);
            }}
            value={address}
            disabled={check}
            className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
            type="text"
            placeholder="enter the owner address"
          />
          <br />
          <input
            onChange={(event) => {
              setCollection(event.target.value);
            }}
            value={collection}
            className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
            type="text"
            placeholder="enter the collection address"
          />
          <br />
          <label className="text-gray-600">
            <input
              onChange={(event) => {
                setCheck(event.target.checked);
              }}
              type="checkbox"
              className="mr-2"
            />
            Fetch for collection
          </label>
          <br />
          <button
            className={
              "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
            }
            onClick={() => {
              check ? getNftsForCollection() : getNftsForOwner();
            }}
          >
            submit
          </button>
        </div>
        <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
          {NFTs.length &&
            NFTs.map((nft) => {
              return (
                <>
                  <Card nft={nft} />
                </>
              );
            })}
          {NFTs.length && check ? (
            <div className="flex w-full justify-center ">
              <button
                className="mr-4"
                onClick={() => changePage(currentPage - 1)}
              >
                previous
              </button>
              {currentPage + 1}
              <button
                className="ml-4"
                onClick={() => changePage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default home;
